const mongoose = require('mongoose');

const analysisTextSeoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  text: {
    type: String,
    required: [true, 'Le texte à analyser est requis'],
    maxlength: [10000, 'Le texte ne peut pas dépasser 10000 caractères']
  },
  seoScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  metrics: {
    wordCount: {
      type: Number,
      required: true
    },
    characterCount: {
      type: Number,
      required: true
    }
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
analysisTextSeoSchema.index({ userId: 1, createdAt: -1 });

// Méthode pour obtenir un résumé de l'analyse
analysisTextSeoSchema.methods.getSummary = function() {
  return {
    id: this._id,
    seoScore: this.seoScore,
    wordCount: this.metrics.wordCount,
    characterCount: this.metrics.characterCount,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('AnalysisTextSeo', analysisTextSeoSchema); 