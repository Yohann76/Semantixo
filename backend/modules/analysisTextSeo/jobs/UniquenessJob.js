const AnalysisTextSeo = require('../models/AnalysisTextSeo');
const JobUtils = require('./JobUtils');
const { UniquenessJob: UniquenessJobModel } = require('../models');

class UniquenessJobProcessor {
  static async process(job) {
    const { analysisId, text } = job.data;
    const startTime = Date.now();
    
    try {
      // Créer l'enregistrement du job en base avec tous les champs requis
      const jobRecord = new UniquenessJobModel({
        analysisId,
        jobName: 'uniqueness',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await jobRecord.save();
      console.log(`✅ [UniquenessJobProcessor] Job créé en base pour ${analysisId}`);

      // Plus besoin d'appeler updateJobStatus - on met à jour directement notre propre collection

      await job.progress(30);

      const analysis = await UniquenessJobProcessor.analyzeUniqueness(text);
      await job.progress(70);

      const recommendations = UniquenessJobProcessor.generateRecommendations(analysis);

      // Mettre à jour l'enregistrement du job en base
      await UniquenessJobModel.findOneAndUpdate(
        { analysisId, jobName: 'uniqueness' },
        {
          status: 'completed',
          score: analysis.score,
          details: `Originalité: ${analysis.uniquenessPercentage}%, diversité vocabulaire: ${analysis.vocabularyDiversity}%`,
          metrics: {
            uniquenessPercentage: analysis.uniquenessPercentage,
            vocabularyDiversity: analysis.vocabularyDiversity,
            repetitionRate: analysis.repetitionRate,
            uniqueWords: analysis.uniqueWords,
            totalWords: analysis.totalWords,
            duplicateContent: analysis.duplicateContent || [],
            similarityIndex: analysis.similarityIndex || 0
          },
          recommendations: recommendations,
          processingTime: Date.now() - startTime,
          rawData: { text, analysis }
        },
        { upsert: true, new: true }
      );

      await job.progress(100);

      // Mettre à jour le score global APRÈS la sauvegarde réussie
      await JobUtils.updateGlobalScore(analysisId);
      
      return {
        success: true,
        score: analysis.score,
        metrics: analysis,
        recommendations: recommendations
      };

    } catch (error) {
      console.error(`❌ [UniquenessJobProcessor] Erreur pour ${analysisId}:`, error);
      
      // Mettre à jour l'enregistrement du job en base (erreur)
      await UniquenessJobModel.findOneAndUpdate(
        { analysisId, jobName: 'uniqueness' },
        {
          status: 'failed',
          error: {
            message: error.message,
            stack: error.stack
          },
          processingTime: Date.now() - startTime
        },
        { upsert: true, new: true }
      );
      
      // Mettre à jour le score global même en cas d'erreur
      try {
        await JobUtils.updateGlobalScore(analysisId);
      } catch (globalError) {
        console.error('❌ Erreur mise à jour score global:', globalError);
      }
      
      throw error;
    }
  }

  static async analyzeUniqueness(text) {
    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
    const words = cleanText.split(/\s+/).filter(word => word.length > 2); // Ignorer les mots très courts
    const totalWords = words.length;
    
    if (totalWords === 0) {
      return {
        score: 0,
        uniquenessPercentage: 0,
        vocabularyDiversity: 0,
        repetitionRate: 100,
        uniqueWords: 0,
        totalWords: 0
      };
    }
    
    // Calculer la diversité du vocabulaire
    const wordFrequency = {};
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    const uniqueWords = Object.keys(wordFrequency).length;
    const vocabularyDiversity = (uniqueWords / totalWords) * 100;
    
    // Analyser les répétitions
    let repetitionScore = 0;
    let overusedWords = 0;
    
    // Mots communs à ignorer (articles, prépositions, etc.)
    const commonWords = new Set([
      'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou', 'que', 'qui', 
      'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles', 'ce', 'cette', 'ces',
      'dans', 'sur', 'avec', 'pour', 'par', 'sans', 'sous', 'vers', 'chez',
      'est', 'sont', 'était', 'être', 'avoir', 'fait', 'faire', 'dit', 'dire',
      'très', 'plus', 'moins', 'bien', 'mal', 'tout', 'tous', 'toute', 'toutes'
    ]);
    
    Object.entries(wordFrequency).forEach(([word, frequency]) => {
      if (!commonWords.has(word) && word.length > 3) {
        const expectedFrequency = Math.max(1, Math.floor(totalWords / 100)); // 1% max
        if (frequency > expectedFrequency * 3) {
          overusedWords++;
          repetitionScore -= (frequency - expectedFrequency) * 2;
        }
      }
    });
    
    // Calculer le score d'originalité (sur 15 car poids = 15)
    let uniquenessScore = 15;
    
    // Pénaliser la faible diversité
    if (vocabularyDiversity < 30) {
      uniquenessScore -= (30 - vocabularyDiversity) * 0.3; // 2% de 15
    }
    
    // Pénaliser les répétitions excessives
    uniquenessScore += Math.max(-7.5, repetitionScore * 0.15); // 50% de 15
    
    // Bonus pour bonne diversité
    if (vocabularyDiversity > 50) {
      uniquenessScore += 1.5; // 10% de 15
    }
    
    // Analyser les phrases répétitives (approximation)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const sentenceStarts = sentences.map(s => s.trim().substring(0, 20).toLowerCase());
    const uniqueSentenceStarts = new Set(sentenceStarts).size;
    
    if (sentences.length > 0) {
      const sentenceDiversity = (uniqueSentenceStarts / sentences.length) * 100;
      if (sentenceDiversity < 80) {
        uniquenessScore -= (80 - sentenceDiversity) * 0.075; // 0.5% de 15
      }
    }
    
    uniquenessScore = Math.max(0, Math.min(15, uniquenessScore));
    
    return {
      score: Math.round(uniquenessScore),
      uniquenessPercentage: Math.round(uniquenessScore),
      vocabularyDiversity: Math.round(vocabularyDiversity * 10) / 10,
      repetitionRate: Math.round((100 - vocabularyDiversity) * 10) / 10,
      uniqueWords,
      totalWords,
      overusedWords,
      sentenceDiversity: sentences.length > 0 ? Math.round((uniqueSentenceStarts / sentences.length) * 100) : 100
    };
  }

  static generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.vocabularyDiversity < 40) {
      recommendations.push("Enrichissez votre vocabulaire pour éviter les répétitions");
    }
    
    if (analysis.overusedWords > 0) {
      recommendations.push(`${analysis.overusedWords} mot(s) sont sur-utilisé(s). Variez vos expressions`);
    }
    
    if (analysis.sentenceDiversity < 70) {
      recommendations.push("Variez la structure de vos phrases pour plus d'originalité");
    }
    
    if (analysis.vocabularyDiversity > 60) {
      recommendations.push("Excellente diversité de vocabulaire !");
    }
    
    if (analysis.uniquenessPercentage < 50) {
      recommendations.push("Travaillez l'originalité de votre contenu pour vous démarquer");
    }
    
    if (analysis.totalWords < 100) {
      recommendations.push("Un contenu plus long permettrait une meilleure analyse d'originalité");
    }
    
    return recommendations;
  }
}

module.exports = UniquenessJobProcessor;
