// Utilitaires communs pour tous les jobs
const AnalysisTextSeo = require('../models/AnalysisTextSeo');

class JobUtils {
  /**
   * Met à jour le statut d'un job de manière atomique avec retry
   */
  static async updateJobStatus(analysisId, jobName, status, updateData, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Mise à jour atomique avec findOneAndUpdate
        const updateQuery = {
          $set: {
            [`jobs.$[job].status`]: status,
            [`jobs.$[job].info.details`]: updateData.details || 'Traitement terminé',
            [`jobs.$[job].info.completedAt`]: updateData.completedAt || new Date(),
          }
        };

        // Ajouter les métriques si présentes
        if (updateData.metrics) {
          updateQuery.$set[`jobs.$[job].info.metrics`] = updateData.metrics;
        }
        if (updateData.recommendations) {
          updateQuery.$set[`jobs.$[job].info.recommendations`] = updateData.recommendations;
        }
        if (updateData.score !== undefined) {
          updateQuery.$set[`jobs.$[job].info.score`] = updateData.score;
        }

        const result = await AnalysisTextSeo.findOneAndUpdate(
          { _id: analysisId },
          updateQuery,
          {
            arrayFilters: [{ 'job.name': jobName }],
            new: true
          }
        );

        if (!result) {
          console.error(`❌ [${jobName}] Analyse non trouvée: ${analysisId}`);
          return null;
        }

        console.log(`✅ [${jobName}] Statut mis à jour (tentative ${attempt})`);
        
        // Vérifier si tous les jobs sont terminés pour calculer le score final
        await this.checkAndUpdateFinalScore(result);
        
        return result;

      } catch (error) {
        if (error.name === 'VersionError' && attempt < retries) {
          console.warn(`⚠️ [${jobName}] Conflit version, retry ${attempt}/${retries}`);
          await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // Backoff exponential
          continue;
        }
        
        console.error(`❌ [${jobName}] Erreur mise à jour statut:`, error);
        throw error;
      }
    }
  }

  /**
   * Vérifie si tous les jobs sont terminés et calcule le score final
   */
  static async checkAndUpdateFinalScore(analysis) {
    try {
      const allCompleted = analysis.jobs.every(job => 
        job.status === 'completed' || job.status === 'failed'
      );

      if (allCompleted) {
        // Recalculer le score final
        const newScore = analysis.calculateScoreSeo();
        
        await AnalysisTextSeo.findOneAndUpdate(
          { _id: analysis._id },
          { 
            $set: { 
              status: 'completed', 
              scoreSeo: newScore 
            } 
          }
        );
        
        console.log(`🎉 [JobUtils] Analyse ${analysis._id} terminée - Score final: ${newScore}`);
      }
    } catch (error) {
      console.error(`❌ [JobUtils] Erreur calcul score final:`, error.message);
    }
  }
}

module.exports = JobUtils;
