// Utilitaires communs pour tous les jobs - NOUVELLE ARCHITECTURE
const AnalysisAggregationService = require('../services/AnalysisAggregationService');

class JobUtils {
  /**
   * @deprecated Cette méthode est obsolète avec la nouvelle architecture
   * Les jobs mettent maintenant à jour directement leurs propres collections
   * Utiliser updateGlobalScore() après la completion d'un job à la place
   */
  static async updateJobStatus(analysisId, jobName, status, updateData, retries = 3) {
    console.log(`⚠️ [JobUtils] DEPRECATED: updateJobStatus appelée pour ${jobName}. Ignorée avec la nouvelle architecture.`);
    // Ne fait plus rien - compatibilité temporaire
    return null;
  }

  /**
   * Met à jour le score global après completion d'un job
   * À appeler après qu'un job ait mis à jour sa propre collection
   */
  static async updateGlobalScore(analysisId) {
    try {
      // Attendre un peu pour s'assurer que MongoDB a persisté les données
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await AnalysisAggregationService.updateGlobalScore(analysisId);
      console.log(`🎯 [JobUtils] Score global mis à jour pour ${analysisId}: ${result.score}/100 (${result.progress}%)`);
      return result;
    } catch (error) {
      console.error('❌ [JobUtils] Erreur mise à jour score global:', error);
      throw error;
    }
  }

  /**
   * @deprecated Utiliser updateGlobalScore à la place
   */
  static async checkAndUpdateFinalScore(analysis) {
    console.log(`⚠️ [JobUtils] DEPRECATED: checkAndUpdateFinalScore. Utiliser updateGlobalScore.`);
    if (analysis && analysis._id) {
      return this.updateGlobalScore(analysis._id);
    }
    return null;
  }
}

module.exports = JobUtils;
