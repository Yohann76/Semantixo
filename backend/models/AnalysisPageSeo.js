const mongoose = require('mongoose');

const analysisPageSeoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  url: {
    type: String,
    required: [true, 'L\'URL de la page est requise'],
    trim: true
  },
  pageTitle: {
    type: String,
    required: true
  },
  metaDescription: {
    type: String,
    required: true
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
    headingCount: {
      type: Number,
      required: true
    },
    imageCount: {
      type: Number,
      required: true
    },
    linkCount: {
      type: Number,
      required: true
    }
  },
  seoElements: {
    hasTitle: {
      type: Boolean,
      required: true
    },
    hasMetaDescription: {
      type: Boolean,
      required: true
    },
    hasHeadings: {
      type: Boolean,
      required: true
    },
    hasImages: {
      type: Boolean,
      required: true
    },
    hasLinks: {
      type: Boolean,
      required: true
    }
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
analysisPageSeoSchema.index({ userId: 1, createdAt: -1 });
analysisPageSeoSchema.index({ url: 1 });

// Méthode pour obtenir un résumé de l'analyse
analysisPageSeoSchema.methods.getSummary = function() {
  return {
    id: this._id,
    url: this.url,
    pageTitle: this.pageTitle,
    seoScore: this.seoScore,
    wordCount: this.metrics.wordCount,
    characterCount: this.metrics.characterCount,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('AnalysisPageSeo', analysisPageSeoSchema); 