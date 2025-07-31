/**
 * Moteur de scoring SEO principal
 * Principe d'Ouverture/Fermeture (OCP) et d'Inversion de Dépendance (DIP)
 */

const IScoringEngine = require('./interfaces/IScoringEngine')
const ScoringConfig = require('./config/ScoringConfig')
const KeywordUsageEvaluator = require('./evaluators/KeywordUsageEvaluator')
const KeywordPositionEvaluator = require('./evaluators/KeywordPositionEvaluator')
const ContentLengthEvaluator = require('./evaluators/ContentLengthEvaluator')
const ReadabilityEvaluator = require('./evaluators/ReadabilityEvaluator')
const UniquenessEvaluator = require('./evaluators/UniquenessEvaluator')

class ScoringEngine extends IScoringEngine {
  constructor() {
    super()
    this.config = new ScoringConfig()
    this.evaluators = []
    this.initializeDefaultEvaluators()
  }

  /**
   * Initialise les évaluateurs par défaut
   */
  initializeDefaultEvaluators() {
    this.addEvaluator(new KeywordUsageEvaluator(this.config))
    this.addEvaluator(new KeywordPositionEvaluator(this.config))
    this.addEvaluator(new ContentLengthEvaluator(this.config))
    this.addEvaluator(new ReadabilityEvaluator(this.config))
    this.addEvaluator(new UniquenessEvaluator(this.config))
  }

  /**
   * Ajoute un évaluateur au moteur
   */
  addEvaluator(evaluator) {
    this.evaluators.push(evaluator)
  }

  /**
   * Évalue un texte selon tous les critères
   */
  async evaluateText(text, keywords = []) {
    if (!this.config.enabled) {
      throw new Error('Le système de scoring est désactivé')
    }

    if (!text || typeof text !== 'string') {
      throw new Error('Le texte à analyser est requis et doit être une chaîne de caractères')
    }

    const results = {
      analyzedText: text.substring(0, 100) + '...',
      targetKeywords: keywords,
      scoringVersion: this.config.version,
      totalScore: 0,
      maxScore: this.config.totalPoints,
      grade: '',
      criteria: {},
      recommendations: [],
      metrics: {},
      timestamp: new Date().toISOString()
    }

    // Évaluer chaque critère
    const evaluations = []
    
    for (const evaluator of this.evaluators) {
      if (evaluator.isEnabled()) {
        const evaluation = await evaluator.evaluate({ text, keywords })
        const criteriaInfo = evaluator.getCriteriaInfo()
        
        // Ajouter les informations du critère à l'évaluation
        evaluation.criteria = criteriaInfo
        
        evaluations.push(evaluation)
        
        results.criteria[criteriaInfo.id] = {
          name: criteriaInfo.name,
          weight: criteriaInfo.weight,
          score: evaluation.score,
          maxScore: evaluation.maxScore,
          details: evaluation.details
        }
      }
    }

    // Calculer le score total
    results.totalScore = evaluations.reduce((total, evaluation) => total + evaluation.score, 0)

    // Déterminer la notation
    results.grade = this.determineGrade(results.totalScore)

    // Générer les recommandations
    results.recommendations = this.generateRecommendations(evaluations)

    // Calculer les métriques
    results.metrics = this.calculateMetrics(text, evaluations)

    return results
  }

  /**
   * Détermine la notation basée sur le score
   */
  determineGrade(score) {
    const { grading } = this.config
    
    for (const [level, threshold] of Object.entries(grading)) {
      if (score >= threshold.min) {
        return threshold.label
      }
    }
    
    return 'Insuffisant'
  }

  /**
   * Génère des recommandations basées sur les évaluations
   */
  generateRecommendations(evaluations) {
    const recommendations = []

    evaluations.forEach(evaluation => {
      const scoreRate = evaluation.score / evaluation.maxScore
      
      // Si le score est inférieur à 70%, ajouter une recommandation
      if (scoreRate < 0.7) {
        recommendations.push({
          criteria: evaluation.criteria?.name || 'Critère',
          currentScore: evaluation.score,
          maxScore: evaluation.maxScore,
          percentage: Math.round(scoreRate * 100),
          recommendation: this.getRecommendationMessage(evaluation)
        })
      }
    })

    return recommendations
  }

  /**
   * Obtient un message de recommandation pour une évaluation
   */
  getRecommendationMessage(evaluation) {
    const messages = {
      keyword_usage: 'Développez le champ lexical de vos mots-clés en utilisant des synonymes et variations.',
      keyword_position: 'Placez vos mots-clés dans le premier paragraphe et au début des paragraphes suivants.',
      content_length: 'Rédigez un contenu suffisamment long (minimum 50 mots, idéalement plus de 500 mots).',
      readability: 'Structurez votre contenu avec une densité appropriée et une découpe en paragraphes claire.',
      uniqueness: 'Évitez la duplication de contenu pour maintenir l\'originalité de votre texte.'
    }

    return messages[evaluation.criteria?.id] || 'Améliorez ce critère pour optimiser votre score SEO.'
  }

  /**
   * Calcule des métriques détaillées
   */
  calculateMetrics(text, evaluations) {
    const words = text.split(/\s+/).filter(word => word.trim().length > 0).length
    const characters = text.length
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length

    return {
      textStatistics: {
        wordCount: words,
        characterCount: characters,
        paragraphCount: paragraphs,
        averageWordsPerParagraph: Math.round(words / paragraphs) || 0
      },
      scoreDistribution: evaluations.map(evaluation => ({
        criteria: evaluation.criteria?.name || 'Critère',
        score: evaluation.score,
        weight: evaluation.criteria?.weight || 0,
        percentage: Math.round((evaluation.score / evaluation.maxScore) * 100)
      })),
      globalPerformance: {
        averageScore: Math.round(evaluations.reduce((acc, evaluation) => 
          acc + (evaluation.score / evaluation.maxScore), 0) / evaluations.length * 100),
        excellentCriteria: evaluations.filter(evaluation => 
          (evaluation.score / evaluation.maxScore) >= 0.8).length,
        needsImprovement: evaluations.filter(evaluation => 
          (evaluation.score / evaluation.maxScore) < 0.6).length
      }
    }
  }

  /**
   * Obtient la configuration du moteur
   */
  getConfiguration() {
    return this.config.getConfig()
  }

  /**
   * Valide la configuration
   */
  validateConfiguration() {
    return this.config.validate()
  }
}

module.exports = ScoringEngine 