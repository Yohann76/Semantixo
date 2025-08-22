const AnalysisTextSeo = require('../models/AnalysisTextSeo');
const JobUtils = require('./JobUtils');
const { ContentLengthJob: ContentLengthJobModel } = require('../models');

class ContentLengthJobProcessor {
  static async process(job) {
    const { analysisId, text } = job.data;
    const startTime = Date.now();
    
    try {
      // Créer l'enregistrement du job en base avec tous les champs requis
      const jobRecord = new ContentLengthJobModel({
        analysisId,
        jobName: 'content-length',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await jobRecord.save();
      console.log(`✅ [ContentLengthJobProcessor] Job créé en base pour ${analysisId}`);

      // Plus besoin d'appeler updateJobStatus - on met à jour directement notre propre collection

      await job.progress(50);

      const analysis = await ContentLengthJobProcessor.analyzeContentLength(text);
      await job.progress(80);

      const recommendations = ContentLengthJobProcessor.generateRecommendations(analysis);

      // Mettre à jour le score global de l'analyse après completion
      await JobUtils.updateGlobalScore(analysisId);

      // Mettre à jour l'enregistrement du job en base
      await ContentLengthJobModel.findOneAndUpdate(
        { analysisId, jobName: 'content-length' },
        {
          status: 'completed',
          score: analysis.score,
          details: `Longueur analysée: ${analysis.wordCount} mots, ${analysis.charCount} caractères`,
          metrics: {
            wordCount: analysis.wordCount,
            charCount: analysis.charCount,
            paragraphCount: analysis.paragraphCount,
            sentenceCount: analysis.sentenceCount,
            lengthCategory: analysis.lengthCategory,
            avgWordsPerParagraph: analysis.avgWordsPerParagraph,
            avgWordsPerSentence: analysis.avgWordsPerSentence
          },
          recommendations: recommendations,
          processingTime: Date.now() - startTime,
          rawData: { text, analysis }
        },
        { upsert: true, new: true }
      );

      await job.progress(100);


      
      return {
        success: true,
        score: analysis.score,
        metrics: analysis,
        recommendations: recommendations
      };

    } catch (error) {
      console.error(`❌ [ContentLengthJobProcessor] Erreur pour ${analysisId}:`, error);
      
      // Mettre à jour l'enregistrement du job en base (erreur)
      await ContentLengthJobModel.findOneAndUpdate(
        { analysisId, jobName: 'content-length' },
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

  static async analyzeContentLength(text) {
    const cleanText = text.trim();
    
    // Compter les mots
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Compter les caractères
    const charCount = cleanText.length;
    
    // Compter les paragraphes
    const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphs.length;
    
    // Compter les phrases (approximatif)
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const sentenceCount = sentences.length;
    
    // Déterminer la catégorie de longueur
    let lengthCategory;
    let score = 0;
    
    if (wordCount < 150) {
      lengthCategory = 'Très court';
      score = 20; // Trop court pour un bon SEO
    } else if (wordCount < 300) {
      lengthCategory = 'Court';
      score = 50; // Acceptable mais pourrait être plus long
    } else if (wordCount < 600) {
      lengthCategory = 'Moyen';
      score = 80; // Bonne longueur
    } else if (wordCount < 1200) {
      lengthCategory = 'Long';
      score = 90; // Excellente longueur
    } else if (wordCount < 2500) {
      lengthCategory = 'Très long';
      score = 85; // Très bien mais attention à la densité
    } else {
      lengthCategory = 'Extrêmement long';
      score = 70; // Risque de dilution du message
    }
    
    // Bonus pour structure (paragraphes)
    if (paragraphCount > 1) {
      const avgWordsPerParagraph = wordCount / paragraphCount;
      if (avgWordsPerParagraph >= 50 && avgWordsPerParagraph <= 150) {
        score += 10; // Bonne structure de paragraphes
      }
    }
    
    // Bonus pour lisibilité (phrases)
    if (sentenceCount > 0) {
      const avgWordsPerSentence = wordCount / sentenceCount;
      if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) {
        score += 5; // Phrases de longueur appropriée
      }
    }
    
    return {
      score: Math.min(score, 100),
      wordCount,
      charCount,
      paragraphCount,
      sentenceCount,
      lengthCategory,
      avgWordsPerParagraph: paragraphCount > 0 ? Math.round(wordCount / paragraphCount) : 0,
      avgWordsPerSentence: sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0
    };
  }

  static generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.wordCount < 300) {
      recommendations.push(`Augmentez la longueur du contenu (actuellement ${analysis.wordCount} mots, recommandé: 300+ mots)`);
    }
    
    if (analysis.wordCount > 2500) {
      recommendations.push("Considérez diviser ce contenu en plusieurs articles pour une meilleure lisibilité");
    }
    
    if (analysis.paragraphCount <= 1 && analysis.wordCount > 100) {
      recommendations.push("Structurez votre contenu en plusieurs paragraphes pour améliorer la lisibilité");
    }
    
    if (analysis.avgWordsPerParagraph > 200) {
      recommendations.push("Divisez vos longs paragraphes en sections plus courtes (150 mots max par paragraphe)");
    }
    
    if (analysis.avgWordsPerSentence > 30) {
      recommendations.push("Raccourcissez vos phrases pour améliorer la lisibilité (25 mots max par phrase)");
    }
    
    if (analysis.wordCount >= 300 && analysis.wordCount <= 1200) {
      recommendations.push("Excellente longueur de contenu pour le SEO !");
    }
    
    return recommendations;
  }
}

module.exports = ContentLengthJobProcessor;
