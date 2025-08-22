/**
 * Utilitaires pour l'analyse SEO de texte
 * Version simplifiée sans système de barème
 */

const { findKeywordsFromText } = require('./findKeywordFromTopic')

/**
 * Analyse SEO simplifiée d'un texte
 * @param {string} text - Le texte à analyser
 * @param {Array} keywords - Les mots-clés ciblés
 * @returns {Object} Résultats d'analyse simplifiés
 */
const analyzeTextSeo = async (text, keywords = []) => {
  try {
    // Analyse de base (métriques simples)
    const basicMetrics = {
      wordCount: text.split(/\s+/).length,
      characterCount: text.length,
      paragraphCount: text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
      averageWordLength: Math.round(text.replace(/\s+/g, '').length / text.split(/\s+/).length)
    }

    // Analyse des mots-clés extraits du texte
    const keywordAnalysis = await findKeywordsFromText(text, keywords)

    return {
      success: true,
      seoScore: 0, // Sera calculé par les jobs
      basicMetrics,
      keywordAnalysis: keywordAnalysis.success ? keywordAnalysis.keywords : null,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse SEO:', error.message)
    return {
      success: false,
      error: error.message,
      seoScore: 0,
      basicMetrics: {},
      keywordAnalysis: null,
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Obtient la configuration des jobs d'analyse
 * @returns {Object} Configuration des jobs
 */
const getJobsConfiguration = () => {
  return {
    jobs: [
      {
        name: 'keyword-analysis',
        displayName: 'Analyse des mots-clés',
        weight: 40,
        description: 'Analyse la présence et la fréquence des mots-clés'
      },
      {
        name: 'keyword-position',
        displayName: 'Position des mots-clés',
        weight: 15,
        description: 'Vérifie la position stratégique des mots-clés'
      },
      {
        name: 'content-length',
        displayName: 'Longueur du contenu',
        weight: 15,
        description: 'Évalue la longueur optimale du contenu'
      },
      {
        name: 'readability',
        displayName: 'Lisibilité',
        weight: 15,
        description: 'Analyse la facilité de lecture du texte'
      },
      {
        name: 'uniqueness',
        displayName: 'Originalité',
        weight: 15,
        description: 'Vérifie l\'originalité et l\'unicité du contenu'
      }
    ],
    totalWeight: 100,
    version: '2.0.0'
  }
}

module.exports = {
  // Fonction principale d'analyse
  analyzeTextSeo,
  
  // Configuration des jobs
  getJobsConfiguration
} 