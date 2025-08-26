const mongoose = require('mongoose');

const KeywordAnalysisJobSchema = new mongoose.Schema({
  // Référence vers l'analyse principale
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalysisTextSeo',
    required: true
  },
  
  // Métadonnées du job
  jobName: {
    type: String,
    default: 'keyword-analysis',
    required: true
  },
  
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed', 'failed'],
    default: 'waiting'
  },
  
  // Poids dans le score SEO
  poidScoreSEO: {
    type: Number,
    required: true,
    default: 40
  },
  
  // Résultats de l'analyse
  score: {
    type: Number,
    min: 0,
    max: 40
  },
  
  details: {
    type: String
  },
  
  // Métriques spécifiques à l'analyse des mots-clés
  metrics: {
    // Métriques de base
    keywordDensity: Number,
    keywordCount: Number,
    wordCount: Number,
    relevanceScore: Number,
    
    // Analyse SERP
    serpAnalysis: {
      totalPagesAnalyzed: Number,
      averageWordCount: Number,
      topKeywords: [{
        keyword: String,
        frequency: Number,
        tfidf: Number
      }],
      keywordFrequencyStats: {
        mean: Number,
        standardDeviation: Number
      }
    },
    
    // Analyse du texte cible
    targetTextAnalysis: {
      keywordFrequency: [{
        keyword: String,
        frequency: Number,
        density: Number
      }],
      keywordDistribution: [String],
      missingKeywords: [String],
      overusedKeywords: [String]
    },
    
    // Scores SEO
    seoScores: {
      sosScore: Number, // Proximité avec la fréquence optimale
      dseoScore: Number, // Mesure de la sur-utilisation
      overallRelevance: Number
    },
    
    // Graphiques et visualisations
    visualizationData: {
      keywordComparison: [{
        keyword: String,
        targetFrequency: Number,
        actualFrequency: Number,
        optimalRange: {
          min: Number,
          max: Number
        }
      }],
      densityChart: [{
        keyword: String,
        density: Number,
        optimalDensity: Number
      }]
    }
  },
  
  // Recommandations
  recommendations: [String],
  
  // Données brutes pour debugging
  rawData: mongoose.Schema.Types.Mixed,
  
  // Temps d'exécution
  processingTime: {
    type: Number, // en millisecondes
    default: 0
  },
  
  // Erreurs éventuelles
  error: {
    message: String,
    stack: String
  }
}, {
  timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

// Index pour les requêtes fréquentes
KeywordAnalysisJobSchema.index({ analysisId: 1, status: 1 });
KeywordAnalysisJobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('KeywordAnalysisJob', KeywordAnalysisJobSchema);
