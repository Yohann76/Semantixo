const mongoose = require('mongoose');

const ReadabilityJobSchema = new mongoose.Schema({
  // Référence vers l'analyse principale
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalysisTextSeo',
    required: true
  },
  
  // Métadonnées du job
  jobName: {
    type: String,
    default: 'readability',
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
  
  // Métriques spécifiques à la lisibilité
  metrics: {
    readabilityScore: Number,
    fleschScore: Number,
    readingLevel: {
      type: String,
      enum: ['very-easy', 'easy', 'fairly-easy', 'standard', 'fairly-difficult', 'difficult', 'very-difficult']
    },
    avgSentenceLength: Number,
    avgSyllablesPerWord: Number,
    complexWords: Number,
    totalSentences: Number,
    totalSyllables: Number
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
ReadabilityJobSchema.index({ analysisId: 1, status: 1 });
ReadabilityJobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ReadabilityJob', ReadabilityJobSchema);
