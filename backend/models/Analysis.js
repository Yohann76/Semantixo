const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
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
    },
    keywordDensity: {
      type: Number,
      default: 0
    },
    readabilityScore: {
      type: Number,
      default: 0
    }
  },
  keywords: [{
    word: String,
    count: Number,
    density: Number
  }],
  suggestions: [{
    type: String,
    category: {
      type: String,
      enum: ['keyword', 'readability', 'structure', 'technical'],
      default: 'keyword'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  processingTime: {
    type: Number, // en millisecondes
    default: 0
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ seoScore: -1 });

// Méthode pour calculer le score SEO global
analysisSchema.methods.calculateOverallScore = function() {
  const factors = {
    keywordDensity: this.metrics.keywordDensity * 0.3,
    readability: this.metrics.readabilityScore * 0.2,
    wordCount: Math.min(this.metrics.wordCount / 100, 1) * 0.2,
    suggestions: Math.max(0, 1 - this.suggestions.length / 10) * 0.3
  };
  
  return Math.round(Object.values(factors).reduce((sum, factor) => sum + factor, 0) * 100);
};

// Méthode pour obtenir un résumé de l'analyse
analysisSchema.methods.getSummary = function() {
  return {
    id: this._id,
    seoScore: this.seoScore,
    wordCount: this.metrics.wordCount,
    characterCount: this.metrics.characterCount,
    suggestionsCount: this.suggestions.length,
    createdAt: this.createdAt,
    status: this.status
  };
};

module.exports = mongoose.model('Analysis', analysisSchema); 