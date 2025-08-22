import { authFetch } from './auth';

const API_BASE = '/api/analysis-text-seo';

class AnalysisTextSeoService {
  
  /**
   * Créer une nouvelle analyse
   * @param {string} text - Texte à analyser
   * @param {Array} keywords - Mots-clés
   * @returns {Promise} Résultat de la création
   */
  static async createAnalysis(text, keywords = []) {
    console.log('📤 [API] Création analyse:', { textLength: text.length, keywordsCount: keywords.length });
    
    const response = await authFetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, keywords })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création de l\'analyse');
    }

    const result = await response.json();
    console.log('✅ [API] Analyse créée:', result.data);
    return result.data;
  }

  /**
   * Obtenir une vue d'ensemble d'une analyse (métadonnées + résumé jobs)
   * @param {string} analysisId - ID de l'analyse
   * @returns {Promise} Vue d'ensemble
   */
  static async getAnalysisOverview(analysisId) {
    console.log('📤 [API] Récupération overview:', analysisId);
    
    const response = await authFetch(`${API_BASE}/${analysisId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Analyse non trouvée');
    }

    const result = await response.json();
    console.log('✅ [API] Overview reçue:', result.data);
    return result.data;
  }

  /**
   * Obtenir une analyse complète (métadonnées + détails complets des jobs)
   * @param {string} analysisId - ID de l'analyse
   * @returns {Promise} Analyse complète
   */
  static async getAnalysisComplete(analysisId) {
    console.log('📤 [API] Récupération complète:', analysisId);
    
    const response = await authFetch(`${API_BASE}/${analysisId}/complete`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Analyse non trouvée');
    }

    const result = await response.json();
    console.log('✅ [API] Analyse complète reçue:', result.data);
    return result.data;
  }

  /**
   * Obtenir les détails d'un job spécifique
   * @param {string} analysisId - ID de l'analyse
   * @param {string} jobType - Type de job (keyword-analysis, readability, etc.)
   * @returns {Promise} Détails du job
   */
  static async getJobDetails(analysisId, jobType) {
    console.log('📤 [API] Récupération job:', { analysisId, jobType });
    
    const response = await authFetch(`${API_BASE}/${analysisId}/jobs/${jobType}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Job non trouvé');
    }

    const result = await response.json();
    console.log('✅ [API] Job reçu:', result.data);
    return result.data;
  }

  /**
   * Obtenir la liste des analyses pour l'historique
   * @param {number} page - Page à récupérer
   * @param {number} limit - Nombre d'éléments par page
   * @returns {Promise} Liste paginée
   */
  static async getAnalysesList(page = 1, limit = 10) {
    console.log('📤 [API] Récupération liste:', { page, limit });
    
    const response = await authFetch(`${API_BASE}?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération de la liste');
    }

    const result = await response.json();
    console.log('✅ [API] Liste reçue:', { count: result.data?.length, pagination: result.pagination });
    return result;
  }

  /**
   * Supprimer une analyse
   * @param {string} analysisId - ID de l'analyse
   * @returns {Promise} Résultat de la suppression
   */
  static async deleteAnalysis(analysisId) {
    console.log('📤 [API] Suppression analyse:', analysisId);
    
    const response = await authFetch(`${API_BASE}/${analysisId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la suppression');
    }

    const result = await response.json();
    console.log('✅ [API] Analyse supprimée');
    return result;
  }

  /**
   * Obtenir la configuration des jobs disponibles
   * @returns {Promise} Configuration des jobs
   */
  static async getJobsConfig() {
    console.log('📤 [API] Récupération config jobs');
    
    const response = await authFetch(`${API_BASE}/jobs/config`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération de la configuration');
    }

    const result = await response.json();
    console.log('✅ [API] Config jobs reçue:', result.data);
    return result.data;
  }

  // ===== MÉTHODES DE COMPATIBILITÉ TEMPORAIRE =====

  /**
   * @deprecated Utiliser getAnalysisOverview à la place
   * Polling pour vérifier le statut d'une analyse
   */
  static async checkAnalysisStatus(analysisId) {
    console.log('⚠️ [API] DEPRECATED: checkAnalysisStatus, utiliser getAnalysisOverview');
    return this.getAnalysisOverview(analysisId);
  }

  // ===== MÉTHODES UTILITAIRES =====

  /**
   * Démarrer un polling pour suivre le progrès d'une analyse
   * @param {string} analysisId - ID de l'analyse
   * @param {Function} onUpdate - Callback appelé à chaque mise à jour
   * @param {number} interval - Intervalle en millisecondes (défaut: 2000)
   * @returns {Function} Fonction pour arrêter le polling
   */
  static startProgressPolling(analysisId, onUpdate, interval = 2000) {
    console.log('🔄 [API] Démarrage polling pour:', analysisId);
    
    const polling = setInterval(async () => {
      try {
        const overview = await this.getAnalysisOverview(analysisId);
        onUpdate(overview);
        
        // Arrêter le polling si l'analyse est terminée
        if (overview.status === 'completed' || overview.status === 'failed') {
          console.log('🏁 [API] Polling terminé, statut:', overview.status);
          clearInterval(polling);
        }
      } catch (error) {
        console.error('❌ [API] Erreur polling:', error);
        onUpdate({ error: error.message });
      }
    }, interval);

    // Retourner une fonction pour arrêter le polling
    return () => {
      console.log('⏹️ [API] Arrêt polling pour:', analysisId);
      clearInterval(polling);
    };
  }
}

export default AnalysisTextSeoService;
