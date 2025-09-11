const mongoose = require('mongoose');

// Modèle léger pour l'analyse de texte SEO (métadonnées uniquement)
const AnalysisTextSeoSchema = new mongoose.Schema({
  request_id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parameter: {
    text: { type: String, required: true },
    keywords: [String]
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  scoreSeo: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  metadata: {
    version: { type: String, default: '2.0' },
    strategy: { type: String, default: 'detailed_jobs' },
    completedAt: Date,
    jobsCount: { type: Number, default: 5 }
  }
}, {
  timestamps: true
});

// Configuration des jobs disponibles
AnalysisTextSeoSchema.statics.getJobsConfig = function() {
  return [
    { type: 'keyword-analysis', weight: 70, name: 'Analyse des mots-clés' },
    { type: 'readability', weight: 10, name: 'Lisibilité' },
    { type: 'uniqueness', weight: 20, name: 'Originalité' }
  ];
};

// Méthode pour calculer le score basé sur les jobs externes
AnalysisTextSeoSchema.methods.calculateProgress = function() {
  // Le progress sera calculé par l'agrégation des jobs
  return this.progress;
};

// Méthode utilitaire pour la notation
AnalysisTextSeoSchema.methods.getNotation = function() {
  const score = this.scoreSeo;
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Très bon';
  if (score >= 55) return 'Bon';
  if (score >= 40) return 'Moyen';
  return 'À améliorer';
};

module.exports = mongoose.model('AnalysisTextSeo', AnalysisTextSeoSchema);