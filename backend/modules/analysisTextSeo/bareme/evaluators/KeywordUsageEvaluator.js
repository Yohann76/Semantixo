/**
 * Évaluateur pour l'utilisation des mots-clés
 * Principe de Responsabilité Unique (SRP)
 */

const IEvaluator = require('../interfaces/IEvaluator')
const { analyserMotsClesThematiques } = require('../keywordDetector')

class KeywordUsageEvaluator extends IEvaluator {
  constructor(config) {
    super()
    this.config = config
    this.criteria = config.criteria.keywordUsage
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

    // Analyse automatique des mots-clés thématiques
    const thematicAnalysis = analyserMotsClesThematiques(text)
    
    // Évaluation de la déclinaison des mots-clés
    const declinationScore = this.evaluateKeywordDeclination(text, keywords, thematicAnalysis)
    
    // Évaluation de la correspondance parfaite
    const correspondenceScore = this.evaluatePerfectCorrespondence(text, keywords, thematicAnalysis)
    
    const totalScore = declinationScore + correspondenceScore

    return {
      score: totalScore,
      maxScore: this.criteria.weight,
      details: {
        declination: declinationScore,
        correspondence: correspondenceScore,
        thematicAnalysis: thematicAnalysis
      }
    }
  }

  evaluateKeywordDeclination(text, keywords, thematicAnalysis) {
    const textLower = text.toLowerCase()
    let totalVariations = 0
    let detectedVariations = 0

    // Analyser les mots-clés fournis par l'utilisateur
    keywords.forEach(keyword => {
      const variations = this.generateLexicalVariations(keyword.toLowerCase())
      totalVariations += variations.length
      
      variations.forEach(variation => {
        if (textLower.includes(variation)) {
          detectedVariations++
        }
      })
    })

    // Analyser les mots-clés thématiques détectés
    thematicAnalysis.motsClesThematiques.forEach(keyword => {
      const variations = this.generateLexicalVariations(keyword.mot.toLowerCase())
      totalVariations += variations.length
      
      variations.forEach(variation => {
        if (textLower.includes(variation)) {
          detectedVariations++
        }
      })
    })

    const usageRate = totalVariations > 0 ? detectedVariations / totalVariations : 0
    return this.calculateScore(usageRate, 30)
  }

  evaluatePerfectCorrespondence(text, keywords, thematicAnalysis) {
    const textLower = text.toLowerCase()
    let foundKeywords = 0
    let perfectMatches = 0

    // Analyser les mots-clés fournis par l'utilisateur
    keywords.forEach(keyword => {
      const occurrences = (textLower.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
      if (occurrences > 0) {
        foundKeywords++
        if (this.isAppropriateContext(text, keyword)) {
          perfectMatches++
        }
      }
    })

    // Analyser les mots-clés thématiques
    thematicAnalysis.motsClesThematiques.forEach(keyword => {
      const occurrences = (textLower.match(new RegExp(keyword.mot.toLowerCase(), 'g')) || []).length
      if (occurrences > 0) {
        foundKeywords++
        if (this.isAppropriateContext(text, keyword.mot)) {
          perfectMatches++
        }
      }
    })

    const correspondenceRate = foundKeywords > 0 ? perfectMatches / foundKeywords : 0
    return this.calculateScore(correspondenceRate, 30)
  }

  generateLexicalVariations(keyword) {
    const variations = [keyword]
    
    // Variations simples
    if (keyword.endsWith('s')) {
      variations.push(keyword.slice(0, -1))
    }
    if (keyword.endsWith('e')) {
      variations.push(keyword.slice(0, -1))
    }
    
    // Variations avec accents
    const accentVariations = {
      'e': ['é', 'è', 'ê'],
      'a': ['à', 'â'],
      'i': ['î', 'ï'],
      'o': ['ô'],
      'u': ['ù', 'û', 'ü']
    }
    
    Object.entries(accentVariations).forEach(([letter, accents]) => {
      if (keyword.includes(letter)) {
        accents.forEach(accent => {
          variations.push(keyword.replace(new RegExp(letter, 'g'), accent))
        })
      }
    })
    
    return [...new Set(variations)]
  }

  isAppropriateContext(text, keyword) {
    const context = text.toLowerCase()
    const keywordLower = keyword.toLowerCase()
    const regex = new RegExp(`\\b${keywordLower}\\b`, 'g')
    const matches = context.match(regex) || []
    return matches.length > 0
  }

  calculateScore(rate, maxScore) {
    if (rate >= 0.8) return maxScore
    if (rate >= 0.6) return Math.round(maxScore * 0.83)
    if (rate >= 0.4) return Math.round(maxScore * 0.67)
    if (rate >= 0.2) return Math.round(maxScore * 0.5)
    if (rate > 0) return Math.round(maxScore * 0.33)
    return 0
  }
}

module.exports = KeywordUsageEvaluator 