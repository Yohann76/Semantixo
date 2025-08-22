const AnalysisTextSeo = require('../models/AnalysisTextSeo');
const JobUtils = require('./JobUtils');
const { ReadabilityJob: ReadabilityJobModel } = require('../models');
const { JobProcessorUtils } = require('../utils');

class ReadabilityJobProcessor {
  static async process(job) {
    const { analysisId, text } = job.data;
    const startTime = Date.now();
    
    try {
      // Valider les données d'entrée
      JobProcessorUtils.validateJobData(job.data, ['analysisId', 'text']);
      
      // Créer l'enregistrement du job en base
      await JobProcessorUtils.createJobRecord(ReadabilityJobModel, analysisId, 'readability');
      
      // Mettre à jour la progression
      await JobProcessorUtils.updateProgress(job, 20);

      // Analyse de la lisibilité
      const analysis = await ReadabilityJobProcessor.analyzeReadability(text);
      await JobProcessorUtils.updateProgress(job, 60);

      // Générer des recommandations
      const recommendations = ReadabilityJobProcessor.generateRecommendations(analysis);
      await JobProcessorUtils.updateProgress(job, 80);

      // Sauvegarder les résultats avec score 0
      await JobProcessorUtils.updateJobWithResults(
        ReadabilityJobModel,
        analysisId,
        'readability',
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
      console.error(`❌ [ReadabilityJobProcessor] Erreur pour ${analysisId}:`, error);
      
      // Mettre à jour le job avec l'erreur
      await JobProcessorUtils.updateJobWithError(
        ReadabilityJobModel,
        analysisId,
        'readability',
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

  static async analyzeReadability(text) {
    // Score fixe à 0 - Aucune logique d'évaluation
    return {
      score: 0,
      fleschScore: 0,
      readingLevel: 'Score fixe à 0',
      avgSentenceLength: 0,
      avgSyllablesPerWord: 0,
      complexWords: 0,
      complexWordsPercentage: 0
    };
  }

  static generateRecommendations(analysis) {
    // Recommandations fixes - Score fixe à 0
    return ['Score fixe à 0 - Aucune logique d\'évaluation'];
  }
}

module.exports = ReadabilityJobProcessor;
