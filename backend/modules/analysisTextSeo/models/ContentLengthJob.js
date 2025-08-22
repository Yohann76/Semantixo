const mongoose = require('mongoose');

const ContentLengthJobSchema = new mongoose.Schema({
  // Référence vers l'analyse principale
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalysisTextSeo',
    required: true
  },
  
  // Métadonnées du job
  jobName: {
    type: String,
    default: 'content-length',
    required: true
  },
  
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed', 'failed'],
    default: 'waiting'
  },
  

  
  // Résultats de l'analyse
  score: {
    type: Number,
    min: 0,
    max: 15  // Score sur 15 (poids du job)
  },
  
  details: {
    type: String
  },
  
  // Métriques simplifiées pour la longueur du contenu
  metrics: {
    charCount: Number,  // Nombre de caractères
    lengthCategory: {
      type: String,
      enum: ['Très court', 'Court', 'Moyen', 'Optimal']  // Nouvelles catégories
    },
    percentage: Number  // Pourcentage du score max (0-100%)
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
ContentLengthJobSchema.index({ analysisId: 1, status: 1 });
ContentLengthJobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ContentLengthJob', ContentLengthJobSchema);
