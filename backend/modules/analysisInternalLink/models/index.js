const mongoose = require('mongoose');

const analysisInternalLinkSchema = new mongoose.Schema({
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
  internalLinkScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  metrics: {
    totalInternalLinks: {
      type: Number,
      required: true
    },
    totalExternalLinks: {
      type: Number,
      required: true
    },
    brokenLinks: {
      type: Number,
      required: true
    },
    uniqueInternalPages: {
      type: Number,
      required: true
    },
    averageInternalLinksPerPage: {
      type: Number,
      required: true
    }
  },
  internalLinkElements: {
    hasInternalLinks: {
      type: Boolean,
      required: true
    },
    hasBrokenLinks: {
      type: Boolean,
      required: true
    },
    hasOptimalDistribution: {
      type: Boolean,
      required: true
    },
    hasDescriptiveAnchorText: {
      type: Boolean,
      required: true
    }
  },
  internalPages: [{
    url: String,
    title: String,
    internalLinksCount: Number,
    externalLinksCount: Number
  }],
  brokenLinks: [{
    url: String,
    anchorText: String,
    statusCode: Number
  }]
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
analysisInternalLinkSchema.index({ userId: 1, createdAt: -1 });
analysisInternalLinkSchema.index({ url: 1 });

// Méthode pour obtenir un résumé de l'analyse
analysisInternalLinkSchema.methods.getSummary = function() {
  return {
    id: this._id,
    url: this.url,
    internalLinkScore: this.internalLinkScore,
    totalInternalLinks: this.metrics.totalInternalLinks,
    totalExternalLinks: this.metrics.totalExternalLinks,
    brokenLinks: this.metrics.brokenLinks,
    uniqueInternalPages: this.metrics.uniqueInternalPages,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('AnalysisInternalLink', analysisInternalLinkSchema); 