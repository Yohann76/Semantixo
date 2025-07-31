/**
 * Évaluateur pour la lisibilité
 * Principe de Responsabilité Unique (SRP)
 */

const IEvaluator = require('../interfaces/IEvaluator')

class ReadabilityEvaluator extends IEvaluator {
  constructor(config) {
    super()
    this.config = config
    this.criteria = config.criteria.readability
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

    // Évaluation de la densité des mots
    const densityResult = this.evaluateWordDensity(text)
    
    // Évaluation de la découpe en paragraphes
    const paragraphResult = this.evaluateParagraphStructure(text)
    
    const totalScore = densityResult.score + paragraphResult.score

    return {
      score: totalScore,
      maxScore: this.criteria.weight,
      details: {
        density: densityResult,
        paragraphStructure: paragraphResult
      }
    }
  }

  evaluateWordDensity(text) {
    const words = text.split(/\s+/).filter(word => word.trim().length > 0)
    const uniqueWords = new Set(words.map(word => word.toLowerCase()))
    const density = uniqueWords.size / words.length
    
    let score = 0
    
    if (density >= 0.8) {
      score = 5
    } else if (density >= 0.6) {
      score = 4
    } else if (density >= 0.4) {
      score = 3
    } else if (density >= 0.2) {
      score = 2
    } else {
      score = 1
    }

    return {
      score,
      maxScore: 5,
      details: {
        vocabularyDensity: Math.round(density * 100) / 100,
        uniqueWords: uniqueWords.size,
        totalWords: words.length
      }
    }
  }

  evaluateParagraphStructure(text) {
    const paragraphs = this.getParagraphs(text)
    const words = text.split(/\s+/).filter(word => word.trim().length > 0)
    const wordsPerParagraph = paragraphs.length > 0 ? words.length / paragraphs.length : 0
    
    let score = 0
    
    if (paragraphs.length >= 4 && wordsPerParagraph >= 50 && wordsPerParagraph <= 200) {
      score = 5
    } else if (paragraphs.length >= 3 && wordsPerParagraph >= 30 && wordsPerParagraph <= 300) {
      score = 4
    } else if (paragraphs.length >= 2 && wordsPerParagraph >= 20) {
      score = 3
    } else if (paragraphs.length >= 1) {
      score = 2
    } else {
      score = 0
    }

    return {
      score,
      maxScore: 5,
      details: {
        paragraphCount: paragraphs.length,
        wordsPerParagraph: Math.round(wordsPerParagraph),
        optimalStructure: score >= 4
      }
    }
  }

  getParagraphs(text) {
    return text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  }
}

module.exports = ReadabilityEvaluator 