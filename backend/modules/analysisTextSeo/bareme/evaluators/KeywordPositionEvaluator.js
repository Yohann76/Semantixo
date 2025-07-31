/**
 * Évaluateur pour la position des mots-clés
 * Principe de Responsabilité Unique (SRP)
 */

const IEvaluator = require('../interfaces/IEvaluator')

class KeywordPositionEvaluator extends IEvaluator {
  constructor(config) {
    super()
    this.config = config
    this.criteria = config.criteria.keywordPosition
  }

  isEnabled() {
    return this.criteria.enabled
  }

  getCriteriaInfo() {
    return this.criteria
  }

  evaluate(context) {
    const { text, keywords = [] } = context
    
    if (!this.isEnabled()) {
      return {
        score: 0,
        maxScore: this.criteria.weight,
        details: { reason: 'Critère désactivé' }
      }
    }

    // Évaluation des mots-clés dans le premier paragraphe
    const firstParagraphScore = this.evaluateFirstParagraph(text, keywords)
    
    // Évaluation des mots-clés au début des paragraphes
    const paragraphStartScore = this.evaluateParagraphStarts(text, keywords)
    
    const totalScore = firstParagraphScore + paragraphStartScore

    return {
      score: totalScore,
      maxScore: this.criteria.weight,
      details: {
        firstParagraph: firstParagraphScore,
        paragraphStarts: paragraphStartScore
      }
    }
  }

  evaluateFirstParagraph(text, keywords) {
    const paragraphs = this.getParagraphs(text)
    const firstParagraph = paragraphs.length > 0 ? paragraphs[0].toLowerCase() : ''
    
    let foundKeywords = 0

    keywords.forEach(keyword => {
      if (firstParagraph.includes(keyword.toLowerCase())) {
        foundKeywords++
      }
    })

    const presenceRate = keywords.length > 0 ? foundKeywords / keywords.length : 0
    return this.calculateScore(presenceRate, 5)
  }

  evaluateParagraphStarts(text, keywords) {
    const paragraphs = this.getParagraphs(text)
    let paragraphsWithKeywords = 0

    paragraphs.forEach(paragraph => {
      const paragraphStart = paragraph.substring(0, Math.min(100, paragraph.length)).toLowerCase()
      let keywordFound = false
      
      keywords.forEach(keyword => {
        if (paragraphStart.includes(keyword.toLowerCase())) {
          keywordFound = true
        }
      })
      
      if (keywordFound) {
        paragraphsWithKeywords++
      }
    })

    const paragraphRate = paragraphs.length > 0 ? paragraphsWithKeywords / paragraphs.length : 0
    return this.calculateScore(paragraphRate, 5)
  }

  getParagraphs(text) {
    return text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  }

  calculateScore(rate, maxScore) {
    if (rate >= 0.8) return maxScore
    if (rate >= 0.6) return Math.round(maxScore * 0.8)
    if (rate >= 0.4) return Math.round(maxScore * 0.6)
    if (rate >= 0.2) return Math.round(maxScore * 0.4)
    if (rate > 0) return Math.round(maxScore * 0.2)
    return 0
  }
}

module.exports = KeywordPositionEvaluator 