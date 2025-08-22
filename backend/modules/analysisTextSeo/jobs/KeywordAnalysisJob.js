const AnalysisTextSeo = require('../models/AnalysisTextSeo');
const JobUtils = require('./JobUtils');
const { KeywordAnalysisJob: KeywordAnalysisJobModel } = require('../models');
const { JobProcessorUtils } = require('../utils');

class KeywordAnalysisJobProcessor {
  static async process(job) {
    const { analysisId, text, keywords } = job.data;
    const startTime = Date.now();
    
    try {
      // Valider les données d'entrée
      JobProcessorUtils.validateJobData(job.data, ['analysisId', 'text', 'keywords']);
      // Créer l'enregistrement du job en base
      await JobProcessorUtils.createJobRecord(KeywordAnalysisJobModel, analysisId, 'keyword-analysis');
      
      // Mettre à jour la progression
      await JobProcessorUtils.updateProgress(job, 20);

      // Analyse des mots-clés
      const analysis = await KeywordAnalysisJobProcessor.analyzeKeywords(text, keywords);
      await JobProcessorUtils.updateProgress(job, 60);

      // Générer des recommandations
      const recommendations = KeywordAnalysisJobProcessor.generateRecommendations(analysis);
      await JobProcessorUtils.updateProgress(job, 80);

      // Sauvegarder les résultats avec score 0
      await JobProcessorUtils.updateJobWithResults(
        KeywordAnalysisJobModel,
        analysisId,
        'keyword-analysis',
        analysis,
        recommendations,
        startTime,
        { text, keywords, analysis }
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
      console.error(`❌ [KeywordAnalysisJobProcessor] Erreur pour ${analysisId}:`, error);
      
      // Mettre à jour le job avec l'erreur
      await JobProcessorUtils.updateJobWithError(
        KeywordAnalysisJobModel,
        analysisId,
        'keyword-analysis',
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

  static async analyzeKeywords(text, keywords) {
    // Score fixe à 0 - Aucune logique d'évaluation
    return {
      score: 0,
      keywordDensity: 0,
      keywordCount: 0,
      wordCount: JobProcessorUtils.countWords(text),
      relevanceScore: 0
    };
  }

  static generateRecommendations(analysis) {
    // Recommandations fixes - Score fixe à 0
    return ['Score fixe à 0 - Aucune logique d\'évaluation'];
  }
}

module.exports = KeywordAnalysisJobProcessor;
