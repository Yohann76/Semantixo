const mongoose = require('mongoose');

const KeywordPositionJobSchema = new mongoose.Schema({
  // Référence vers l'analyse principale
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalysisTextSeo',
    required: true
  },
  
  // Métadonnées du job
  jobName: {
    type: String,
    default: 'keyword-position',
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
  
  // Métriques spécifiques à la position des mots-clés
  metrics: {
    positionScore: Number,
    titlePresence: Boolean,
    firstParagraphPresence: Boolean,
    distributionScore: Number,
    keywordPositions: [{
      keyword: String,
      positions: [Number], // Positions dans le texte
      inTitle: Boolean,
      inFirstParagraph: Boolean
    }]
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
KeywordPositionJobSchema.index({ analysisId: 1, status: 1 });
KeywordPositionJobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('KeywordPositionJob', KeywordPositionJobSchema);
