const AnalysisTextSeo = require('../models/AnalysisTextSeo');
const JobUtils = require('./JobUtils');
const { ReadabilityJob: ReadabilityJobModel } = require('../models');

class ReadabilityJobProcessor {
  static async process(job) {
    const { analysisId, text } = job.data;
    const startTime = Date.now();
    
    try {
      // Créer l'enregistrement du job en base avec tous les champs requis
      const jobRecord = new ReadabilityJobModel({
        analysisId,
        jobName: 'readability',
        status: 'active',
        createdAt: new Date(),
        timestamp: new Date()
      });
      await jobRecord.save();
      console.log(`✅ [ReadabilityJobProcessor] Job créé en base pour ${analysisId}`);

      // Plus besoin d'appeler updateJobStatus - on met à jour directement notre propre collection

      await job.progress(30);

      const analysis = await ReadabilityJobProcessor.analyzeReadability(text);
      await job.progress(70);

      const recommendations = ReadabilityJobProcessor.generateRecommendations(analysis);

      // Mettre à jour l'enregistrement du job en base
      await ReadabilityJobModel.findOneAndUpdate(
        { analysisId, jobName: 'readability' },
        {
          status: 'completed',
          score: analysis.score,
          details: `Lisibilité: ${analysis.fleschScore}/100, niveau ${analysis.readingLevel}`,
          metrics: {
            readabilityScore: analysis.score,
            fleschScore: analysis.fleschScore,
            readingLevel: analysis.readingLevel,
            avgSentenceLength: analysis.avgSentenceLength,
            avgSyllablesPerWord: analysis.avgSyllablesPerWord,
            complexWords: analysis.complexWords,
            totalSentences: analysis.totalSentences || 0,
            totalSyllables: analysis.totalSyllables || 0
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
      console.error(`❌ [ReadabilityJobProcessor] Erreur pour ${analysisId}:`, error);
      
      // Mettre à jour l'enregistrement du job en base (erreur)
      await ReadabilityJobModel.findOneAndUpdate(
        { analysisId, jobName: 'readability' },
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

  static async analyzeReadability(text) {
    const cleanText = text.replace(/[^\w\s.!?]/g, ' ').trim();
    
    // Compter les phrases
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;
    
    // Compter les mots
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    
    if (wordCount === 0 || sentenceCount === 0) {
      return {
        score: 0,
        fleschScore: 0,
        readingLevel: 'Indéterminable',
        avgSentenceLength: 0,
        avgSyllablesPerWord: 0,
        complexWords: 0
      };
    }
    
    // Calculer la longueur moyenne des phrases
    const avgSentenceLength = wordCount / sentenceCount;
    
    // Estimer le nombre de syllabes (approximation simple pour le français)
    let totalSyllables = 0;
    let complexWords = 0;
    
    words.forEach(word => {
      const syllables = ReadabilityJobProcessor.countSyllables(word);
      totalSyllables += syllables;
      
      // Mots complexes (3+ syllabes)
      if (syllables >= 3) {
        complexWords++;
      }
    });
    
    const avgSyllablesPerWord = totalSyllables / wordCount;
    
    // Formule de Flesch adaptée (approximation pour le français)
    const fleschScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
    ));
    
    // Déterminer le niveau de lecture
    let readingLevel;
    if (fleschScore >= 90) readingLevel = 'Très facile';
    else if (fleschScore >= 80) readingLevel = 'Facile';
    else if (fleschScore >= 70) readingLevel = 'Assez facile';
    else if (fleschScore >= 60) readingLevel = 'Standard';
    else if (fleschScore >= 50) readingLevel = 'Assez difficile';
    else if (fleschScore >= 30) readingLevel = 'Difficile';
    else readingLevel = 'Très difficile';
    
    // Calculer le score SEO basé sur la lisibilité (sur 15 car poids = 15)
    let score = Math.round(fleschScore * 0.8 * 0.15); // Base sur Flesch (15% du poids)
    
    // Bonus/malus selon critères SEO
    if (avgSentenceLength <= 20) score += 1.5; // Phrases courtes (10% de 15)
    if (avgSentenceLength > 30) score -= 1.5; // Phrases trop longues (10% de 15)
    
    if (complexWords / wordCount < 0.15) score += 1.5; // Peu de mots complexes (10% de 15)
    if (complexWords / wordCount > 0.25) score -= 1.5; // Trop de mots complexes (10% de 15)
    
    score = Math.max(0, Math.min(15, score));
    
    return {
      score: Math.round(score),
      fleschScore: Math.round(fleschScore),
      readingLevel,
      avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
      complexWords,
      complexWordsPercentage: Math.round((complexWords / wordCount) * 100)
    };
  }

  static countSyllables(word) {
    // Approximation simple pour compter les syllabes en français
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    // Compter les voyelles consécutives comme une syllabe
    const vowels = 'aeiouyàáâäèéêëìíîïòóôöùúûü';
    let syllables = 0;
    let prevWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !prevWasVowel) {
        syllables++;
      }
      prevWasVowel = isVowel;
    }
    
    // Corrections pour le français
    if (word.endsWith('e') && syllables > 1) {
      syllables--; // Le 'e' final est souvent muet
    }
    
    return Math.max(1, syllables);
  }

  static generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.fleschScore < 50) {
      recommendations.push("Simplifiez votre texte pour améliorer la lisibilité");
    }
    
    if (analysis.avgSentenceLength > 25) {
      recommendations.push(`Raccourcissez vos phrases (moyenne actuelle: ${analysis.avgSentenceLength} mots)`);
    }
    
    if (analysis.complexWordsPercentage > 20) {
      recommendations.push(`Réduisez les mots complexes (actuellement ${analysis.complexWordsPercentage}% du texte)`);
    }
    
    if (analysis.fleschScore >= 60 && analysis.fleschScore <= 80) {
      recommendations.push("Excellente lisibilité pour un contenu web !");
    }
    
    if (analysis.avgSentenceLength <= 20 && analysis.complexWordsPercentage <= 15) {
      recommendations.push("Votre texte est bien structuré et facile à lire");
    }
    
    return recommendations;
  }
}

module.exports = ReadabilityJobProcessor;
