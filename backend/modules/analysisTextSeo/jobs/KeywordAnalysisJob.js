const AnalysisTextSeo = require('../models/AnalysisTextSeo');
const JobUtils = require('./JobUtils');
const { KeywordAnalysisJob: KeywordAnalysisJobModel } = require('../models');
const { JobProcessorUtils, KeywordAnalysisService } = require('../utils');

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

      // Initialiser le service d'analyse des mots-clés
      const keywordService = new KeywordAnalysisService();
      
      // Analyser les mots-clés avec la stratégie complète
      console.log('🔍 [KeywordAnalysisJob] Début de l\'analyse des mots-clés sur 40 points');
      const analysis = await keywordService.analyzeKeywords(text, keywords, keywords);
      await JobProcessorUtils.updateProgress(job, 60);

      // Générer des recommandations basées sur l'analyse
      const recommendations = KeywordAnalysisJobProcessor.generateRecommendations(analysis);
      await JobProcessorUtils.updateProgress(job, 80);

      // Préparer les métriques pour le modèle
      const metrics = KeywordAnalysisJobProcessor.prepareMetrics(analysis);
      
      // Sauvegarder les résultats avec le score calculé
      await JobProcessorUtils.updateJobWithResults(
        KeywordAnalysisJobModel,
        analysisId,
        'keyword-analysis',
        analysis,
        recommendations,
        startTime,
        { text, keywords, analysis, metrics }
      );

      await JobProcessorUtils.updateProgress(job, 100);

      // Mettre à jour le score global avec retry
      await JobProcessorUtils.updateGlobalScoreWithRetry(analysisId);
      
      console.log(`✅ [KeywordAnalysisJob] Analyse terminée avec succès. Score: ${analysis.score}/40`);
      
      return {
        success: true,
        score: analysis.score,
        metrics: metrics,
        recommendations: recommendations
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

  /**
   * Prépare les métriques pour le modèle de base de données
   */
  static prepareMetrics(analysis) {
    const { serpAnalysis, lexicalAnalysis, targetAnalysis, seoScores, visualizationData } = analysis;
    
    return {
      // Métriques de base
      keywordDensity: this.calculateAverageKeywordDensity(targetAnalysis),
      keywordCount: targetAnalysis.keywordAnalysis.length,
      wordCount: targetAnalysis.totalWords,
      relevanceScore: seoScores.overallRelevance,
      
      // Analyse SERP
      serpAnalysis: {
        totalPagesAnalyzed: serpAnalysis.totalPagesAnalyzed,
        averageWordCount: serpAnalysis.averageWordCount,
        topKeywords: lexicalAnalysis.topKeywords,
        keywordFrequencyStats: {
          mean: lexicalAnalysis.wordFrequencies ? 
            Object.values(lexicalAnalysis.wordFrequencies).reduce((sum, freq) => sum + freq, 0) / Object.keys(lexicalAnalysis.wordFrequencies).length : 0,
          standardDeviation: 0 // Calculé dans le service
        }
      },
      
      // Analyse du texte cible
      targetTextAnalysis: {
        keywordFrequency: targetAnalysis.keywordAnalysis.map(k => ({
          keyword: k.keyword,
          frequency: k.frequency,
          density: k.density
        })),
        keywordDistribution: targetAnalysis.keywordAnalysis.map(k => k.keyword),
        missingKeywords: targetAnalysis.missingKeywords,
        overusedKeywords: targetAnalysis.overusedKeywords
      },
      
      // Scores SEO
      seoScores: {
        sosScore: seoScores.sosScore,
        dseoScore: seoScores.dseoScore,
        overallRelevance: seoScores.overallRelevance
      },
      
      // Données de visualisation
      visualizationData: visualizationData
    };
  }

  /**
   * Calcule la densité moyenne des mots-clés
   */
  static calculateAverageKeywordDensity(targetAnalysis) {
    if (!targetAnalysis.keywordAnalysis || targetAnalysis.keywordAnalysis.length === 0) {
      return 0;
    }
    
    const totalDensity = targetAnalysis.keywordAnalysis.reduce((sum, k) => sum + k.density, 0);
    return Math.round((totalDensity / targetAnalysis.keywordAnalysis.length) * 100) / 100;
  }

  /**
   * Génère des recommandations basées sur l'analyse
   */
  static generateRecommendations(analysis) {
    const { targetAnalysis, seoScores, visualizationData } = analysis;
    const recommendations = [];
    
    // Score global
    if (analysis.score >= 35) {
      recommendations.push('🎉 Excellent ! Votre utilisation des mots-clés est optimale.');
    } else if (analysis.score >= 25) {
      recommendations.push('👍 Bien ! Votre texte est bien optimisé pour les mots-clés.');
    } else if (analysis.score >= 15) {
      recommendations.push('⚠️ Moyen. Quelques ajustements pourraient améliorer votre SEO.');
    } else {
      recommendations.push('❌ À améliorer. Votre texte nécessite une meilleure optimisation des mots-clés.');
    }
    
    // Mots-clés manquants
    if (targetAnalysis.missingKeywords.length > 0) {
      const missingCount = Math.min(targetAnalysis.missingKeywords.length, 5);
      recommendations.push(`📝 Considérez d'ajouter ces mots-clés importants : ${targetAnalysis.missingKeywords.slice(0, missingCount).join(', ')}`);
    }
    
    // Mots-clés sur-utilisés
    if (targetAnalysis.overusedKeywords.length > 0) {
      const overusedCount = Math.min(targetAnalysis.overusedKeywords.length, 3);
      recommendations.push(`⚠️ Réduisez l'utilisation excessive de : ${targetAnalysis.overusedKeywords.slice(0, overusedCount).join(', ')}`);
    }
    
    // Densité des mots-clés
    const avgDensity = this.calculateAverageKeywordDensity(targetAnalysis);
    if (avgDensity < 1) {
      recommendations.push('📊 Augmentez légèrement la densité de vos mots-clés principaux.');
    } else if (avgDensity > 3) {
      recommendations.push('📊 Réduisez la densité de vos mots-clés pour éviter le keyword stuffing.');
    }
    
    // Score SOS
    if (seoScores.sosScore < 70) {
      recommendations.push('🎯 Optimisez la fréquence de vos mots-clés pour qu\'elle soit plus proche de la moyenne du marché.');
    }
    
    // Score DSEO
    if (seoScores.dseoScore < 80) {
      recommendations.push('⚖️ Évitez la sur-utilisation de certains mots-clés pour maintenir un bon équilibre.');
    }
    
    return recommendations;
  }
}

module.exports = KeywordAnalysisJobProcessor;
