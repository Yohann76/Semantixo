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

      // Mettre à jour l'enregistrement du job en base
      await ContentLengthJobModel.findOneAndUpdate(
        { analysisId, jobName: 'content-length' },
        {
          status: 'completed',
          score: analysis.score,
                  details: `Longueur analysée: ${analysis.charCount} caractères (${analysis.lengthCategory})`,
        metrics: {
          charCount: analysis.charCount,
          lengthCategory: analysis.lengthCategory,
          percentage: analysis.percentage
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
    
    // Compter les caractères (critère principal)
    const charCount = cleanText.length;
    
    // Calculer le score selon la logique simple
    let score = 0;
    let lengthCategory = '';
    
    if (charCount < 50) {
      score = 0.3; // 2% de 15
      lengthCategory = 'Très court';
    } else if (charCount < 100) {
      score = 7.5; // 50% de 15
      lengthCategory = 'Court';
    } else if (charCount < 150) {
      score = 12; // 80% de 15
      lengthCategory = 'Moyen';
    } else {
      score = 15; // 100% de 15
      lengthCategory = 'Optimal';
    }
    
    return {
      score: Math.round(score), // Score sur 15 (poids du job)
      charCount,
      lengthCategory,
      percentage: Math.round((score / 15) * 100) // Pourcentage du score max
    };
  }

  static generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.charCount < 50) {
      recommendations.push("Votre contenu est trop court. Ajoutez au moins 50 caractères pour un meilleur SEO.");
    } else if (analysis.charCount < 100) {
      recommendations.push("Votre contenu pourrait être plus long. Objectif : 150+ caractères pour un score optimal.");
    } else if (analysis.charCount < 150) {
      recommendations.push("Presque optimal ! Ajoutez quelques caractères pour atteindre le score maximum.");
    } else {
      recommendations.push("Excellente longueur de contenu ! Votre texte a une taille optimale pour le SEO.");
    }
    
    return recommendations;
  }
}

module.exports = ContentLengthJobProcessor;
