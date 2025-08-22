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
    max: 100
  },
  
  details: {
    type: String
  },
  
  // Métriques spécifiques à l'analyse des mots-clés
  metrics: {
    keywordDensity: Number,
    keywordCount: Number,
    wordCount: Number,
    relevanceScore: Number,
    keywordDistribution: [String],
    missingKeywords: [String]
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
