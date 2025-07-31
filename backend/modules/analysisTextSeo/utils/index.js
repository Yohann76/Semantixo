/**
 * Utilitaires pour l'analyse SEO de texte
 * Intègre le système de barème modulaire
 */

const bareme = require('../bareme')

/**
 * Analyse SEO complète d'un texte
 * @param {string} text - Le texte à analyser
 * @param {Array} keywords - Les mots-clés ciblés
 * @returns {Object} Résultats d'analyse avec barème
 */
const analyzeTextSeo = (text, keywords = []) => {
  try {
    // Analyse de base (métriques simples)
    const basicMetrics = {
      wordCount: text.split(/\s+/).length,
      characterCount: text.length,
      paragraphCount: text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
      averageWordLength: Math.round(text.replace(/\s+/g, '').length / text.split(/\s+/).length)
    }

    // Analyse avec le barème SEO
    const baremeResults = bareme.evaluateTextSEO(text, keywords)

    // Calcul du score SEO global
    const seoScore = Math.round((baremeResults.totalScore / baremeResults.maxScore) * 100)

    return {
      success: true,
      seoScore,
      basicMetrics,
      baremeResults,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse SEO:', error.message)
    return {
      success: false,
      error: error.message,
      seoScore: 0,
      basicMetrics: {},
      baremeResults: null,
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Obtient la configuration du barème
 * @returns {Object} Configuration du barème
 */
const getBaremeConfiguration = () => {
  return bareme.getConfiguration()
}

/**
 * Valide la configuration du barème
 * @returns {Object} Résultat de la validation
 */
const validateBaremeConfiguration = () => {
  return bareme.validateConfiguration()
}

/**
 * Active ou désactive un critère du barème
 * @param {string} critereId - L'ID du critère
 * @param {boolean} enabled - Activer ou désactiver
 */
const toggleBaremeCritere = (critereId, enabled = true) => {
  return bareme.toggleCriteria(critereId, enabled)
}

/**
 * Obtient les critères disponibles du barème
 * @returns {Array} Liste des critères disponibles
 */
const getBaremeCriteria = () => {
  return bareme.getAvailableCriteria()
}

/**
 * Obtient les critères disponibles du barème
 * @returns {Array} Liste des critères disponibles
 */
const getBaremeConstantes = () => {
  return bareme.getAvailableCriteria()
}

/**
 * Teste le système de barème avec un exemple
 * @returns {Object} Résultats du test
 */
const testBareme = () => {
  const exempleTexte = `
    ## Introduction au SEO

    Le référencement naturel (SEO) est une technique essentielle pour améliorer la visibilité d'un site web dans les moteurs de recherche.

    ### Les bases du SEO

    - Optimisation des mots-clés
    - Création de contenu de qualité
    - Structure technique du site

    ### Techniques avancées

    1. Optimisation on-page
    2. Stratégie de backlinks
    3. Analyse des performances

    Le SEO nécessite une approche méthodique et une patience constante pour obtenir des résultats durables.
  `

  const motsCles = ['SEO', 'référencement', 'optimisation']
  
  try {
    const resultats = bareme.evaluateTextSEO(exempleTexte, motsCles)
    return {
      success: true,
      resultats,
      message: 'Test du barème réussi'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Test du barème échoué'
    }
  }
}

module.exports = {
  // Fonction principale d'analyse
  analyzeTextSeo,
  
  // Fonctions de gestion du barème
  getBaremeConfiguration,
  validateBaremeConfiguration,
  toggleBaremeCritere,
  getBaremeCriteria,
  getBaremeConstantes,
  
  // Fonction de test
  testBareme,
  
  // Export du module bareme complet
  bareme
} 