/**
 * Module de barème SEO pour l'analyse de texte
 * Architecture refactorisée selon les principes SOLID
 */

const ScoringEngine = require('./ScoringEngine')
const ScoringConfig = require('./config/ScoringConfig')

// Instance principale du moteur de scoring
const scoringEngine = new ScoringEngine()

/**
 * Fonction principale d'évaluation de texte SEO
 * @param {string} text - Le texte à analyser
 * @param {Array} keywords - Les mots-clés ciblés
 * @returns {Object} Résultats complets de l'évaluation
 */
const evaluateTextSEO = (text, keywords = []) => {
  return scoringEngine.evaluateText(text, keywords)
}

/**
 * Obtient la configuration du barème
 * @returns {Object} Configuration complète
 */
const getConfiguration = () => {
  return scoringEngine.getConfiguration()
}

/**
 * Valide la configuration du barème
 * @returns {Object} Résultat de la validation
 */
const validateConfiguration = () => {
  return scoringEngine.validateConfiguration()
}

/**
 * Active ou désactive un critère
 * @param {string} criteriaId - L'ID du critère
 * @param {boolean} enabled - Activer ou désactiver
 */
const toggleCriteria = (criteriaId, enabled = true) => {
  return scoringEngine.config.toggleCriteria(criteriaId, enabled)
}

/**
 * Obtient l'instance du moteur de scoring
 * @returns {ScoringEngine} Instance du moteur
 */
const getScoringEngine = () => {
  return scoringEngine
}

/**
 * Obtient les informations sur les critères disponibles
 * @returns {Object} Informations sur les critères
 */
const getAvailableCriteria = () => {
  const config = scoringEngine.getConfiguration()
  return Object.entries(config.criteria).map(([key, criteria]) => ({
    id: criteria.id,
    name: criteria.name,
    weight: criteria.weight,
    enabled: criteria.enabled,
    description: criteria.description
  }))
}

module.exports = {
  // Instance principale
  scoringEngine,
  
  // Fonctions principales
  evaluateTextSEO,
  getConfiguration,
  validateConfiguration,
  toggleCriteria,
  getScoringEngine,
  getAvailableCriteria,
  
  // Classes pour extensibilité
  ScoringEngine,
  ScoringConfig
} 