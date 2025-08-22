const mongoose = require('mongoose');

const UniquenessJobSchema = new mongoose.Schema({
  // Référence vers l'analyse principale
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalysisTextSeo',
    required: true
  },
  
  // Métadonnées du job
  jobName: {
    type: String,
    default: 'uniqueness',
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
    default: 15
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
  
  // Métriques spécifiques à l'originalité
  metrics: {
    uniquenessPercentage: Number,
    vocabularyDiversity: Number,
    repetitionRate: Number,
    uniqueWords: Number,
    totalWords: Number,
    duplicateContent: [{
      text: String,
      occurrences: Number
    }],
    similarityIndex: Number
  },
  
  // Recommandations
  recommendations: [String],
  
  // Données brutes pour debugging
  rawData: mongoose.Schema.Types.Mixed,
  
  // Temps d'exécution
  processingTime: {
    type: Number,
    default: 0
  },
  
  // Erreurs éventuelles
  error: {
    message: String,
    stack: String
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
UniquenessJobSchema.index({ analysisId: 1, status: 1 });
UniquenessJobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('UniquenessJob', UniquenessJobSchema);
