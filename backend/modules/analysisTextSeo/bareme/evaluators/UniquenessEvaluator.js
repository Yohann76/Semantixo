/**
 * Évaluateur pour l'originalité du contenu
 * Principe de Responsabilité Unique (SRP)
 */

const IEvaluator = require('../interfaces/IEvaluator')

class UniquenessEvaluator extends IEvaluator {
  constructor(config) {
    super()
    this.config = config
    this.criteria = config.criteria.uniqueness
  }

  isEnabled() {
    return this.criteria.enabled
  }

  getCriteriaInfo() {
    return this.criteria
  }

  evaluate(context) {
    const { text } = context
    
    if (!this.isEnabled()) {
      return {
        score: 0,
        maxScore: this.criteria.weight,
        details: { reason: 'Critère désactivé' }
      }
    }

    const duplicationRate = this.calculateDuplicationRate(text)
    const score = this.calculateUniquenessScore(duplicationRate)

    return {
      score,
      maxScore: this.criteria.weight,
      details: {
        duplicationRate: Math.round(duplicationRate * 100) / 100,
        originality: Math.round((1 - duplicationRate) * 100) / 100
      }
    }
  }

  calculateDuplicationRate(text) {
    // Simulation du calcul de duplication
    // Dans un vrai système, on comparerait avec une base de données
    const words = text.split(/\s+/).filter(word => word.trim().length > 0)
    const uniqueWords = new Set(words.map(word => word.toLowerCase()))
    
    // Calculer un taux de duplication basé sur la répétition des mots
    const repetitionRate = 1 - (uniqueWords.size / words.length)
    
    // Ajouter une variation aléatoire pour simuler l'analyse de contenu dupliqué
    const randomFactor = Math.random() * 0.2 // 0-20%
    
    return Math.min(0.3, repetitionRate + randomFactor) // Max 30%
  }

  calculateUniquenessScore(duplicationRate) {
    const thresholds = {
      0.02: 15,   // 0-2%: 15 points
      0.05: 12,   // 2-5%: 12 points
      0.10: 9,    // 5-10%: 9 points
      0.20: 7,    // 10-20%: 7 points
      0.30: 5,    // 20-30%: 5 points
      1.0: 0      // >30%: 0 points
    }
    
    for (const [threshold, points] of Object.entries(thresholds)) {
      if (duplicationRate <= parseFloat(threshold)) {
        return points
      }
    }
    
    return 0
  }
}

module.exports = UniquenessEvaluator 