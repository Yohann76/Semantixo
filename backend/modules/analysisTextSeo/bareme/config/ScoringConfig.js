/**
 * Configuration centralisée du système de scoring SEO
 * Principe de Responsabilité Unique (SRP)
 */

class ScoringConfig {
  constructor() {
    this.version = '2.3.0'
    this.totalPoints = 100 // 100 by default
    this.enabled = true
    
    this.criteria = {
      keywordUsage: {
        id: 'keyword_usage',
        name: 'Utilisation des mots-clés',
        weight: 60,  // 60
        enabled: true, // true
        description: 'Analyse de l\'utilisation des mots-clés et de leur champ lexical'
      },
      keywordPosition: {
        id: 'keyword_position',
        name: 'Position des mots-clés',
        weight: 10,  // 10 
        enabled: true,  // true
        description: 'Analyse de la position des mots-clés dans le texte'
      },
      contentLength: {
        id: 'content_length',
        name: 'Longueur du contenu',
        weight: 10,  // 10 
        enabled: true,  // true
        description: 'Évaluation de la longueur du contenu'
      },
      readability: {
        id: 'readability',
        name: 'Lisibilité',
        weight: 10,  // 10 
        enabled: true,  // true 
        description: 'Analyse de la structure et de la lisibilité'
      },
      uniqueness: {
        id: 'uniqueness',
        name: 'Originalité', // 10 
        weight: 10,  // 10 
        enabled: true,  // true
        description: 'Évaluation de l\'originalité du contenu'
      }
    }

    this.grading = {
      excellent: { min: 60, label: 'Excellent' },  // 85% de 70 = 60
      veryGood: { min: 49, label: 'Très bon' },   // 70% de 70 = 49
      good: { min: 39, label: 'Bon' },            // 55% de 70 = 39
      average: { min: 28, label: 'Moyen' },       // 40% de 70 = 28
      poor: { min: 0, label: 'Insuffisant' }
    }

    this.thresholds = {
      minWords: 50,
      maxWords: 2000,
      minParagraphs: 2,
      maxWordsPerParagraph: 200,
      minKeywordDensity: 0.5,
      maxKeywordDensity: 3.0
    }
  }

  /**
   * Obtient la configuration complète
   */
  getConfig() {
    return {
      version: this.version,
      totalPoints: this.totalPoints,
      enabled: this.enabled,
      criteria: this.criteria,
      grading: this.grading,
      thresholds: this.thresholds
    }
  }

  /**
   * Active ou désactive un critère
   */
  toggleCriteria(criteriaId, enabled = true) {
    if (this.criteria[criteriaId]) {
      this.criteria[criteriaId].enabled = enabled
      return true
    }
    return false
  }

  /**
   * Valide la configuration
   */
  validate() {
    const errors = []
    const warnings = []

    // Vérifier que la somme des poids est égale au total
    const totalWeight = Object.values(this.criteria)
      .filter(c => c.enabled)
      .reduce((sum, c) => sum + c.weight, 0)

    if (totalWeight !== this.totalPoints) {
      errors.push(`La somme des poids (${totalWeight}) ne correspond pas au total (${this.totalPoints})`)
    }

    // Vérifier les critères désactivés
    const disabledCriteria = Object.values(this.criteria).filter(c => !c.enabled)
    if (disabledCriteria.length > 0) {
      warnings.push(`${disabledCriteria.length} critère(s) désactivé(s)`)
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      totalWeight,
      expectedWeight: this.totalPoints
    }
  }
}

module.exports = ScoringConfig 