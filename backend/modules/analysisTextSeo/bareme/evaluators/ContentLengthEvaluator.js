/**
 * Évaluateur pour la longueur du contenu
 * Principe de Responsabilité Unique (SRP)
 */

const IEvaluator = require('../interfaces/IEvaluator')

class ContentLengthEvaluator extends IEvaluator {
  constructor(config) {
    super()
    this.config = config
    this.criteria = config.criteria.contentLength
    this.thresholds = config.thresholds
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

    const wordCount = this.countWords(text)
    const score = this.calculateLengthScore(wordCount)

    return {
      score,
      maxScore: this.criteria.weight,
      details: {
        wordCount,
        minWords: this.thresholds.minWords,
        maxWords: this.thresholds.maxWords,
        lengthLevel: this.getLengthLevel(wordCount)
      }
    }
  }

  countWords(text) {
    return text.split(/\s+/).filter(word => word.trim().length > 0).length
  }

  calculateLengthScore(wordCount) {
    const { minWords, maxWords } = this.thresholds
    
    if (wordCount < minWords) {
      return 0
    }
    
    if (wordCount >= maxWords) {
      return this.criteria.weight
    }
    
    // Échelle progressive
    const scale = [
      { words: 50, points: 1 },
      { words: 100, points: 2 },
      { words: 200, points: 3 },
      { words: 500, points: 4 },
      { words: 2000, points: 5 }
    ]
    
    for (let i = scale.length - 1; i >= 0; i--) {
      if (wordCount >= scale[i].words) {
        return scale[i].points
      }
    }
    
    return 0
  }

  getLengthLevel(wordCount) {
    if (wordCount < 50) return 'insuffisant'
    if (wordCount < 100) return 'minimal'
    if (wordCount < 200) return 'court'
    if (wordCount < 500) return 'moyen'
    if (wordCount < 2000) return 'long'
    return 'très long'
  }
}

module.exports = ContentLengthEvaluator 