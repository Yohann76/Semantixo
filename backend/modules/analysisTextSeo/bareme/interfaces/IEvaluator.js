/**
 * Interface pour les évaluateurs SEO
 * Principe d'Inversion de Dépendance (DIP)
 */

class IEvaluator {
  /**
   * Évalue un critère SEO
   * @param {Object} context - Contexte d'évaluation (texte, mots-clés, etc.)
   * @returns {Object} Résultat de l'évaluation
   */
  evaluate(context) {
    throw new Error('Méthode evaluate() doit être implémentée')
  }

  /**
   * Vérifie si l'évaluateur est activé
   * @returns {boolean}
   */
  isEnabled() {
    throw new Error('Méthode isEnabled() doit être implémentée')
  }

  /**
   * Obtient les informations du critère
   * @returns {Object} Informations du critère
   */
  getCriteriaInfo() {
    throw new Error('Méthode getCriteriaInfo() doit être implémentée')
  }
}

module.exports = IEvaluator 