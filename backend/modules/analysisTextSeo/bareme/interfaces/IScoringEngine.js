/**
 * Interface pour le moteur de scoring SEO
 * Principe d'Inversion de Dépendance (DIP)
 */

class IScoringEngine {
  /**
   * Évalue un texte selon tous les critères
   * @param {string} text - Le texte à analyser
   * @param {Array} keywords - Les mots-clés ciblés
   * @returns {Object} Résultats complets de l'évaluation
   */
  evaluateText(text, keywords = []) {
    throw new Error('Méthode evaluateText() doit être implémentée')
  }

  /**
   * Ajoute un évaluateur au moteur
   * @param {IEvaluator} evaluator - L'évaluateur à ajouter
   */
  addEvaluator(evaluator) {
    throw new Error('Méthode addEvaluator() doit être implémentée')
  }

  /**
   * Obtient la configuration du moteur
   * @returns {Object} Configuration
   */
  getConfiguration() {
    throw new Error('Méthode getConfiguration() doit être implémentée')
  }

  /**
   * Valide la configuration
   * @returns {Object} Résultat de la validation
   */
  validateConfiguration() {
    throw new Error('Méthode validateConfiguration() doit être implémentée')
  }
}

module.exports = IScoringEngine 