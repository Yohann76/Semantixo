class JobProcessorUtils {
  /**
   * Crée un enregistrement de base pour un job
   * @param {Object} model - Le modèle Mongoose du job
   * @param {string} analysisId - ID de l'analyse
   * @param {string} jobName - Nom du job
   * @returns {Object} L'enregistrement du job créé
   */
  static async createJobRecord(model, analysisId, jobName) {
    const jobRecord = new model({
      analysisId,
      jobName,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await jobRecord.save();
    console.log(`✅ [${jobName}] Job créé en base pour ${analysisId}`);
    return jobRecord;
  }

  /**
   * Met à jour un job avec les résultats de l'analyse
   * @param {Object} model - Le modèle Mongoose du job
   * @param {string} analysisId - ID de l'analyse
   * @param {string} jobName - Nom du job
   * @param {Object} analysis - Résultats de l'analyse
   * @param {Array} recommendations - Recommandations
   * @param {number} startTime - Timestamp de début
   * @param {Object} rawData - Données brutes
   * @returns {Object} Le job mis à jour
   */
  static async updateJobWithResults(model, analysisId, jobName, analysis, recommendations, startTime, rawData = {}) {
    const updateData = {
      status: 'completed',
      score: analysis.score || 0,
      details: this.generateDefaultDetails(jobName, analysis),
      metrics: analysis,
      recommendations: recommendations || [],
      processingTime: Date.now() - startTime,
      rawData: rawData
    };

    return await model.findOneAndUpdate(
      { analysisId, jobName },
      updateData,
      { upsert: true, new: true }
    );
  }

  /**
   * Met à jour un job en cas d'erreur
   * @param {Object} model - Le modèle Mongoose du job
   * @param {string} analysisId - ID de l'analyse
   * @param {string} jobName - Nom du job
   * @param {Error} error - L'erreur survenue
   * @param {number} startTime - Timestamp de début
   * @returns {Object} Le job mis à jour
   */
  static async updateJobWithError(model, analysisId, jobName, error, startTime) {
    return await model.findOneAndUpdate(
      { analysisId, jobName },
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
  }

  /**
   * Gère la progression d'un job avec gestion d'erreur
   * @param {Object} job - L'objet job Bull
   * @param {number} progress - Pourcentage de progression (0-100)
   */
  static async updateProgress(job, progress) {
    try {
      await job.progress(progress);
    } catch (error) {
      console.warn(`⚠️ [JobProcessorUtils] Impossible de mettre à jour la progression: ${error.message}`);
    }
  }

  /**
   * Génère des détails par défaut pour un job
   * @param {string} jobName - Nom du job
   * @param {Object} analysis - Résultats de l'analyse
   * @returns {string} Description des détails
   */
  static generateDefaultDetails(jobName, analysis) {
    const jobNames = {
      'keyword-analysis': 'Analyse des mots-clés terminée',
      'keyword-position': 'Analyse de la position des mots-clés terminée',
      'readability': 'Analyse de la lisibilité terminée',
      'uniqueness': 'Analyse de l\'originalité terminée',
      'content-length': 'Analyse de la longueur du contenu terminée'
    };

    return jobNames[jobName] || 'Analyse terminée';
  }

  /**
   * Valide les données d'entrée d'un job
   * @param {Object} jobData - Données du job
   * @param {Array} requiredFields - Champs requis
   * @returns {boolean} True si valide
   */
  static validateJobData(jobData, requiredFields = ['analysisId']) {
    for (const field of requiredFields) {
      if (!jobData[field]) {
        throw new Error(`Champ requis manquant: ${field}`);
      }
    }
    return true;
  }

  /**
   * Gère la mise à jour du score global avec retry
   * @param {string} analysisId - ID de l'analyse
   * @param {number} maxRetries - Nombre maximum de tentatives
   * @returns {Object} Résultat de la mise à jour
   */
  static async updateGlobalScoreWithRetry(analysisId, maxRetries = 3) {
    const JobUtils = require('../jobs/JobUtils');
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await JobUtils.updateGlobalScore(analysisId);
      } catch (error) {
        console.warn(`⚠️ [JobProcessorUtils] Tentative ${attempt}/${maxRetries} échouée: ${error.message}`);
        
        if (attempt === maxRetries) {
          console.error(`❌ [JobProcessorUtils] Échec de la mise à jour du score global après ${maxRetries} tentatives`);
          throw error;
        }
        
        // Attendre avant de réessayer (backoff exponentiel)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
  }

  /**
   * Nettoie le texte pour l'analyse
   * @param {string} text - Texte à nettoyer
   * @returns {string} Texte nettoyé
   */
  static cleanText(text) {
    if (!text || typeof text !== 'string') return '';
    return text.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
  }

  /**
   * Compte les mots dans un texte
   * @param {string} text - Texte à analyser
   * @returns {number} Nombre de mots
   */
  static countWords(text) {
    const cleanText = this.cleanText(text);
    return cleanText.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Compte les phrases dans un texte
   * @param {string} text - Texte à analyser
   * @returns {number} Nombre de phrases
   */
  static countSentences(text) {
    if (!text || typeof text !== 'string') return 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.length;
  }

  /**
   * Calcule le pourcentage d'une valeur
   * @param {number} value - Valeur
   * @param {number} total - Total
   * @param {number} decimals - Nombre de décimales
   * @returns {number} Pourcentage
   */
  static calculatePercentage(value, total, decimals = 2) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100 * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  /**
   * Limite une valeur entre min et max
   * @param {number} value - Valeur à limiter
   * @param {number} min - Minimum
   * @param {number} max - Maximum
   * @returns {number} Valeur limitée
   */
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Arrondit une valeur
   * @param {number} value - Valeur à arrondir
   * @param {number} decimals - Nombre de décimales
   * @returns {number} Valeur arrondie
   */
  static round(value, decimals = 0) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}

module.exports = JobProcessorUtils;
