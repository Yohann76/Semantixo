const AnalysisTextSeo = require('../models/AnalysisTextSeo');
const JobUtils = require('./JobUtils');
const { UniquenessJob: UniquenessJobModel } = require('../models');
const { JobProcessorUtils } = require('../utils');

class UniquenessJobProcessor {
  static async process(job) {
    const { analysisId, text } = job.data;
    const startTime = Date.now();
    
    try {
      // Valider les données d'entrée
      JobProcessorUtils.validateJobData(job.data, ['analysisId', 'text']);
      
      // Créer l'enregistrement du job en base
      await JobProcessorUtils.createJobRecord(UniquenessJobModel, analysisId, 'uniqueness');
      
      // Mettre à jour la progression
      await JobProcessorUtils.updateProgress(job, 20);

      // Analyse de l'originalité
      const analysis = await UniquenessJobProcessor.analyzeUniqueness(text);
      await JobProcessorUtils.updateProgress(job, 60);

      // Générer des recommandations
      const recommendations = UniquenessJobProcessor.generateRecommendations(analysis);
      await JobProcessorUtils.updateProgress(job, 80);

      // Sauvegarder les résultats avec score 0
      await JobProcessorUtils.updateJobWithResults(
        UniquenessJobModel,
        analysisId,
        'uniqueness',
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
        score: 0, // Score fixe à 0
        metrics: { score: 0 },
        recommendations: ['Score fixe à 0 - Aucune logique d\'évaluation']
      };

    } catch (error) {
      console.error(`❌ [UniquenessJobProcessor] Erreur pour ${analysisId}:`, error);
      
      // Mettre à jour le job avec l'erreur
      await JobProcessorUtils.updateJobWithError(
        UniquenessJobModel,
        analysisId,
        'uniqueness',
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

  static async analyzeUniqueness(text) {
    // Score fixe à 0 - Aucune logique d'évaluation
    return {
      score: 0,
      uniquenessPercentage: 0,
      vocabularyDiversity: 0,
      repetitionRate: 100,
      uniqueWords: 0,
      totalWords: 0,
      overusedWords: 0,
      sentenceDiversity: 100
    };
  }

  static generateRecommendations(analysis) {
    // Recommandations fixes - Score fixe à 0
    return ['Score fixe à 0 - Aucune logique d\'évaluation'];
  }
}

module.exports = UniquenessJobProcessor;
