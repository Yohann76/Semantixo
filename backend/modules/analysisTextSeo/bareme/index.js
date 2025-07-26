/**
 * Module de barème SEO pour l'analyse de texte
 * Point d'entrée principal pour le système de notation
 */

const TextSeoScorer = require('./scorer')
const { BAREME_CONFIG, CRITERES, SEUILS_NOTATION, MESSAGES_AIDE } = require('./constants')

/**
 * Instance principale du scorer
 */
const scorer = new TextSeoScorer()

/**
 * Fonction principale d'évaluation de texte SEO
 * @param {string} texte - Le texte à analyser
 * @param {Array} motsCles - Les mots-clés ciblés
 * @param {string} intentionRecherche - L'intention de recherche
 * @returns {Object} Résultats complets de l'évaluation
 */
const evaluerTexteSeo = (texte, motsCles = [], intentionRecherche = 'informationnelle') => {
  return scorer.evaluerTexte(texte, motsCles, intentionRecherche)
}

/**
 * Obtient la configuration du barème
 * @returns {Object} Configuration complète
 */
const getConfiguration = () => {
  return scorer.getConfiguration()
}

/**
 * Valide la configuration du barème
 * @returns {Object} Résultat de la validation
 */
const validerConfiguration = () => {
  return scorer.validerConfiguration()
}

/**
 * Active ou désactive un critère
 * @param {string} critereId - L'ID du critère
 * @param {boolean} enabled - Activer ou désactiver
 */
const toggleCritere = (critereId, enabled = true) => {
  return scorer.toggleCritere(critereId, enabled)
}

/**
 * Active ou désactive un sous-critère
 * @param {string} critereId - L'ID du critère parent
 * @param {string} sousCritereId - L'ID du sous-critère
 * @param {boolean} enabled - Activer ou désactiver
 */
const toggleSousCritere = (critereId, sousCritereId, enabled = true) => {
  return scorer.toggleSousCritere(critereId, sousCritereId, enabled)
}

/**
 * Obtient les constantes du barème
 * @returns {Object} Constantes du barème
 */
const getConstantes = () => {
  return {
    BAREME_CONFIG,
    CRITERES,
    SEUILS_NOTATION,
    MESSAGES_AIDE
  }
}

module.exports = {
  // Instance principale
  scorer,
  
  // Fonctions principales
  evaluerTexteSeo,
  getConfiguration,
  validerConfiguration,
  toggleCritere,
  toggleSousCritere,
  getConstantes,
  
  // Classes et constantes
  TextSeoScorer,
  BAREME_CONFIG,
  CRITERES,
  SEUILS_NOTATION,
  MESSAGES_AIDE
} 