/**
 * Évaluateur de lisibilité du texte
 * Calcule un score sur 10 basé sur plusieurs critères linguistiques
 */

class ReadabilityEvaluator {
  constructor() {
    this.maxScore = 10
  }

  /**
   * Vérifie si l'évaluateur est activé
   */
  isEnabled() {
    return true // Toujours activé
  }

  /**
   * Obtient les informations du critère
   */
  getCriteriaInfo() {
    return {
      id: 'readability',
      name: 'Lisibilité',
      weight: 10,
      enabled: true,
      description: 'Analyse de la structure et de la lisibilité'
    }
  }

  /**
   * Évalue la lisibilité d'un texte
   */
  evaluate(text) {
    if (!text || typeof text !== 'string') {
      return {
        score: 0,
        maxScore: this.maxScore,
        details: {
          error: 'Texte invalide'
        }
      }
    }

    const words = this.extractWords(text)
    const sentences = this.extractSentences(text)
    const paragraphs = this.extractParagraphs(text)

    // Calculs des métriques
    const avgWordLength = this.calculateAverageWordLength(words)
    const avgSentenceLength = this.calculateAverageSentenceLength(sentences)
    const avgParagraphLength = this.calculateAverageParagraphLength(paragraphs)
    const letterFrequency = this.analyzeLetterFrequency(text)
    const vocabularyDiversity = this.calculateVocabularyDiversity(words)
    const punctuationScore = this.analyzePunctuation(text)

    // Scores individuels (0-10)
    const wordLengthScore = this.scoreWordLength(avgWordLength)
    const sentenceLengthScore = this.scoreSentenceLength(avgSentenceLength)
    const paragraphLengthScore = this.scoreParagraphLength(avgParagraphLength)
    const frequencyScore = this.scoreLetterFrequency(letterFrequency)
    const diversityScore = this.scoreVocabularyDiversity(vocabularyDiversity)
    const punctuationScoreValue = this.scorePunctuation(punctuationScore)

    // Score final (moyenne pondérée)
    const finalScore = this.calculateFinalScore({
      wordLength: wordLengthScore,
      sentenceLength: sentenceLengthScore,
      paragraphLength: paragraphLengthScore,
      frequency: frequencyScore,
      diversity: diversityScore,
      punctuation: punctuationScoreValue
    })

    return {
      score: Math.round(finalScore * 10) / 10, // Arrondi à 1 décimale
      maxScore: this.maxScore,
      details: {
        metrics: {
          avgWordLength,
          avgSentenceLength,
          avgParagraphLength,
          vocabularyDiversity,
          letterFrequency: letterFrequency.mostCommon,
          punctuationScore
        },
        scores: {
          wordLength: wordLengthScore,
          sentenceLength: sentenceLengthScore,
          paragraphLength: paragraphLengthScore,
          frequency: frequencyScore,
          diversity: diversityScore,
          punctuation: punctuationScoreValue
        },
        recommendations: this.generateRecommendations({
          wordLength: wordLengthScore,
          sentenceLength: sentenceLengthScore,
          paragraphLength: paragraphLengthScore,
          frequency: frequencyScore,
          diversity: diversityScore,
          punctuation: punctuationScoreValue
        })
      }
    }
  }

  /**
   * Extrait les mots du texte
   */
  extractWords(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0)
  }

  /**
   * Extrait les phrases du texte
   */
  extractSentences(text) {
    return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0)
  }

  /**
   * Extrait les paragraphes du texte
   */
  extractParagraphs(text) {
    return text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0)
  }

  /**
   * Calcule la longueur moyenne des mots
   */
  calculateAverageWordLength(words) {
    if (words.length === 0) return 0
    const totalLength = words.reduce((sum, word) => sum + word.length, 0)
    return Math.round((totalLength / words.length) * 10) / 10
  }

  /**
   * Calcule la longueur moyenne des phrases
   */
  calculateAverageSentenceLength(sentences) {
    if (sentences.length === 0) return 0
    const totalWords = sentences.reduce((sum, sentence) => {
      return sum + this.extractWords(sentence).length
    }, 0)
    return Math.round((totalWords / sentences.length) * 10) / 10
  }

  /**
   * Calcule la longueur moyenne des paragraphes
   */
  calculateAverageParagraphLength(paragraphs) {
    if (paragraphs.length === 0) return 0
    const totalSentences = paragraphs.reduce((sum, paragraph) => {
      return sum + this.extractSentences(paragraph).length
    }, 0)
    return Math.round((totalSentences / paragraphs.length) * 10) / 10
  }

  /**
   * Analyse la fréquence des lettres
   */
  analyzeLetterFrequency(text) {
    const letters = text.toLowerCase().replace(/[^a-z]/g, '').split('')
    const frequency = {}
    
    letters.forEach(letter => {
      frequency[letter] = (frequency[letter] || 0) + 1
    })

    // Trouver les lettres les plus communes
    const sorted = Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)

    return {
      frequency,
      mostCommon: sorted.map(([letter, count]) => ({ letter, count }))
    }
  }

  /**
   * Calcule la diversité du vocabulaire
   */
  calculateVocabularyDiversity(words) {
    if (words.length === 0) return 0
    const uniqueWords = new Set(words)
    return Math.round((uniqueWords.size / words.length) * 100) / 100
  }

  /**
   * Analyse la ponctuation
   */
  analyzePunctuation(text) {
    const punctuationMarks = text.match(/[.!?,;:]/g) || []
    const sentences = this.extractSentences(text)
    
    if (sentences.length === 0) return 0
    
    const avgPunctuationPerSentence = punctuationMarks.length / sentences.length
    return Math.round(avgPunctuationPerSentence * 10) / 10
  }

  /**
   * Score pour la longueur des mots (0-10)
   */
  scoreWordLength(avgLength) {
    // Idéal : 4-6 lettres par mot
    if (avgLength >= 4 && avgLength <= 6) return 10
    if (avgLength >= 3 && avgLength <= 7) return 8
    if (avgLength >= 2 && avgLength <= 8) return 6
    if (avgLength >= 1 && avgLength <= 9) return 4
    return 2
  }

  /**
   * Score pour la longueur des phrases (0-10)
   */
  scoreSentenceLength(avgLength) {
    // Idéal : 15-25 mots par phrase
    if (avgLength >= 15 && avgLength <= 25) return 10
    if (avgLength >= 10 && avgLength <= 30) return 8
    if (avgLength >= 8 && avgLength <= 35) return 6
    if (avgLength >= 5 && avgLength <= 40) return 4
    return 2
  }

  /**
   * Score pour la longueur des paragraphes (0-10)
   */
  scoreParagraphLength(avgLength) {
    // Idéal : 3-5 phrases par paragraphe
    if (avgLength >= 3 && avgLength <= 5) return 10
    if (avgLength >= 2 && avgLength <= 6) return 8
    if (avgLength >= 1 && avgLength <= 8) return 6
    if (avgLength >= 1 && avgLength <= 10) return 4
    return 2
  }

  /**
   * Score pour la fréquence des lettres (0-10)
   */
  scoreLetterFrequency(letterData) {
    // Vérifier si les lettres les plus communes sont des voyelles
    const vowels = ['a', 'e', 'i', 'o', 'u', 'y']
    const mostCommonLetters = letterData.mostCommon.slice(0, 3)
    const vowelCount = mostCommonLetters.filter(item => vowels.includes(item.letter)).length
    
    if (vowelCount >= 2) return 10
    if (vowelCount >= 1) return 7
    return 4
  }

  /**
   * Score pour la diversité du vocabulaire (0-10)
   */
  scoreVocabularyDiversity(diversity) {
    // Idéal : 60-80% de mots uniques
    if (diversity >= 0.6 && diversity <= 0.8) return 10
    if (diversity >= 0.5 && diversity <= 0.9) return 8
    if (diversity >= 0.4 && diversity <= 0.95) return 6
    if (diversity >= 0.3 && diversity <= 1) return 4
    return 2
  }

  /**
   * Score pour la ponctuation (0-10)
   */
  scorePunctuation(avgPunctuation) {
    // Idéal : 1-2 signes de ponctuation par phrase
    if (avgPunctuation >= 1 && avgPunctuation <= 2) return 10
    if (avgPunctuation >= 0.5 && avgPunctuation <= 3) return 8
    if (avgPunctuation >= 0.3 && avgPunctuation <= 4) return 6
    if (avgPunctuation >= 0.1 && avgPunctuation <= 5) return 4
    return 2
  }

  /**
   * Calcule le score final (moyenne pondérée)
   */
  calculateFinalScore(scores) {
    const weights = {
      wordLength: 0.2,      // 20%
      sentenceLength: 0.25,  // 25%
      paragraphLength: 0.15, // 15%
      frequency: 0.1,        // 10%
      diversity: 0.2,        // 20%
      punctuation: 0.1       // 10%
    }

    const weightedSum = Object.entries(scores).reduce((sum, [key, score]) => {
      return sum + (score * weights[key])
    }, 0)

    return Math.round(weightedSum * 10) / 10
  }

  /**
   * Génère des recommandations d'amélioration
   */
  generateRecommendations(scores) {
    const recommendations = []

    if (scores.wordLength < 6) {
      recommendations.push('Utilisez des mots plus courts pour améliorer la lisibilité')
    }
    if (scores.sentenceLength < 6) {
      recommendations.push('Raccourcissez vos phrases pour une meilleure compréhension')
    }
    if (scores.paragraphLength < 6) {
      recommendations.push('Divisez vos paragraphes en sections plus courtes')
    }
    if (scores.diversity < 6) {
      recommendations.push('Variez davantage votre vocabulaire')
    }
    if (scores.punctuation < 6) {
      recommendations.push('Améliorez la ponctuation pour structurer le texte')
    }

    return recommendations
  }
}

module.exports = ReadabilityEvaluator 