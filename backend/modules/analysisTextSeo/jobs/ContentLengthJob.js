const AnalysisTextSeo = require('../models/AnalysisTextSeo');
const JobUtils = require('./JobUtils');
const { ContentLengthJob: ContentLengthJobModel } = require('../models');
const { JobProcessorUtils } = require('../utils');

class ContentLengthJobProcessor {
  static async process(job) {
    const { analysisId, text } = job.data;
    const startTime = Date.now();
    
    try {
      // Valider les données d'entrée
      JobProcessorUtils.validateJobData(job.data, ['analysisId', 'text']);
      
      // Créer l'enregistrement du job en base
      await JobProcessorUtils.createJobRecord(ContentLengthJobModel, analysisId, 'content-length');
      
      // Mettre à jour la progression
      await JobProcessorUtils.updateProgress(job, 20);

      // Analyse de la longueur du contenu
      const analysis = await ContentLengthJobProcessor.analyzeContentLength(text);
      await JobProcessorUtils.updateProgress(job, 60);

      // Générer des recommandations
      const recommendations = ContentLengthJobProcessor.generateRecommendations(analysis);
      await JobProcessorUtils.updateProgress(job, 80);

      // Sauvegarder les résultats
      await JobProcessorUtils.updateJobWithResults(
        ContentLengthJobModel,
        analysisId,
        'content-length',
        analysis,
        recommendations,
        startTime,
        { text, analysis }
      );

      await JobProcessorUtils.updateProgress(job, 100);

      // Mettre à jour le score global avec retry
      await JobProcessorUtils.updateGlobalScoreWithRetry(analysisId);
      
      return {
        success: true,
        score: analysis.score,
        metrics: analysis,
        recommendations: recommendations
      };

    } catch (error) {
      console.error(`❌ [ContentLengthJobProcessor] Erreur pour ${analysisId}:`, error);
      
      // Mettre à jour le job avec l'erreur
      await JobProcessorUtils.updateJobWithError(
        ContentLengthJobModel,
        analysisId,
        'content-length',
        error,
        startTime
      );
      
      // Mettre à jour le score global même en cas d'erreur
      try {
        await JobProcessorUtils.updateGlobalScoreWithRetry(analysisId);
      } catch (globalError) {
        console.error('❌ Erreur mise à jour score global:', globalError);
      }
      
      throw error;
    }
  }

  static async analyzeContentLength(text) {
    const charCount = text ? text.length : 0;
    
    // Échelle de points selon la longueur (0 à 15 points)
    let score = 0;
    let lengthCategory = '';
    
    if (charCount < 5) {
      score = 0;
      lengthCategory = 'Très court';
    } else if (charCount < 50) {
      score = 1;
      lengthCategory = 'Court';
    } else if (charCount < 100) {
      score = 2;
      lengthCategory = 'Assez court';
    } else if (charCount < 200) {
      score = 3;
      lengthCategory = 'Court-moyen';
    } else if (charCount < 400) {
      score = 4;
      lengthCategory = 'Moyen-court';
    } else if (charCount < 600) {
      score = 5;
      lengthCategory = 'Moyen';
    } else if (charCount < 800) {
      score = 6;
      lengthCategory = 'Moyen-long';
    } else if (charCount < 1000) {
      score = 7;
      lengthCategory = 'Long';
    } else if (charCount < 1200) {
      score = 8;
      lengthCategory = 'Assez long';
    } else if (charCount < 1400) {
      score = 9;
      lengthCategory = 'Très long';
    } else if (charCount < 1600) {
      score = 10;
      lengthCategory = 'Extrêmement long';
    } else if (charCount < 1800) {
      score = 11;
      lengthCategory = 'Excessivement long';
    } else if (charCount < 2000) {
      score = 12;
      lengthCategory = 'Presque optimal';
    } else if (charCount < 2200) {
      score = 13;
      lengthCategory = 'Quasi optimal';
    } else {
      score = 15;
      lengthCategory = 'Optimal';
    }
    
    return {
      score: score,
      charCount: charCount,
      lengthCategory: lengthCategory,
      percentage: Math.round((score / 15) * 100)
    };
  }

  static generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.score === 0) {
      recommendations.push("Votre contenu est trop court. Ajoutez au moins 5 caractères pour commencer à gagner des points.");
    } else if (analysis.score < 5) {
      recommendations.push(`Votre contenu (${analysis.charCount} caractères) est encore trop court. Objectif : 600+ caractères pour un score moyen.`);
    } else if (analysis.score < 10) {
      recommendations.push(`Votre contenu (${analysis.charCount} caractères) progresse bien. Continuez pour atteindre 1400+ caractères.`);
    } else if (analysis.score < 15) {
      recommendations.push(`Excellente longueur (${analysis.charCount} caractères) ! Ajoutez quelques caractères pour atteindre le score maximum.`);
    } else {
      recommendations.push(`Longueur parfaite (${analysis.charCount} caractères) ! Votre contenu a une taille optimale pour le SEO.`);
    }
    
    return recommendations;
  }
}

module.exports = ContentLengthJobProcessor;
