const mongoose = require('mongoose');

const analysisTextSeoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 50000 // Limite augmentée pour les textes longs
  },
  seoScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  metrics: {
    wordCount: {
      type: Number,
      default: 0
    },
    characterCount: {
      type: Number,
      default: 0
    },
    paragraphCount: {
      type: Number,
      default: 0
    },
    averageWordLength: {
      type: Number,
      default: 0
    }
  },
  // Nouveaux champs pour le système de barème
  keywords: {
    type: [String],
    default: []
  },
  searchIntent: {
    type: String,
    enum: ['informationnelle', 'transactionnelle', 'navigationnelle'],
    default: 'informationnelle'
  },
  baremeResults: {
    score_total: {
      type: Number,
      default: 0
    },
    score_maximum: {
      type: Number,
      default: 100
    },
    notation: {
      type: String,
      enum: ['Excellent', 'Très bon', 'Bon', 'Moyen', 'Insuffisant'],
      default: 'Non évalué'
    },
    criteres: {
      pertinence_intention: {
        score: Number,
        sous_criteres: Object
      },
      qualite_contenu: {
        score: Number,
        sous_criteres: Object
      },
      structure_lisibilite: {
        score: Number,
        sous_criteres: Object
      },
      utilisation_mots_cles: {
        score: Number,
        sous_criteres: Object
      },
      originalite_valeur: {
        score: Number,
        sous_criteres: Object
      },
      engagement_ux: {
        score: Number,
        sous_criteres: Object
      },
      techniques_seo_base: {
        score: Number,
        sous_criteres: Object
      }
    },
    recommandations: [{
      critere: String,
      score_actuel: Number,
      score_maximum: Number,
      pourcentage: Number,
      recommandation: String
    }],
    metriques: {
      statistiques_texte: {
        nombre_mots: Number,
        nombre_caracteres: Number,
        nombre_paragraphes: Number,
        longueur_moyenne_paragraphe: Number
      },
      repartition_scores: [{
        critere: String,
        score: Number,
        poids: Number,
        pourcentage: Number
      }],
      performance_globale: {
        score_moyen: Number,
        criteres_excellents: Number,
        criteres_a_ameliorer: Number
      }
    },
    bareme_version: {
      type: String,
      default: '1.0.0'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
analysisTextSeoSchema.index({ userId: 1, createdAt: -1 });
analysisTextSeoSchema.index({ userId: 1, seoScore: -1 });
analysisTextSeoSchema.index({ 'baremeResults.notation': 1 });

// Méthodes statiques
analysisTextSeoSchema.statics.findByUserId = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

analysisTextSeoSchema.statics.findByScoreRange = function(userId, minScore, maxScore) {
  return this.find({ 
    userId, 
    seoScore: { $gte: minScore, $lte: maxScore } 
  }).sort({ createdAt: -1 });
};

analysisTextSeoSchema.statics.findByNotation = function(userId, notation) {
  return this.find({ 
    userId, 
    'baremeResults.notation': notation 
  }).sort({ createdAt: -1 });
};

// Méthodes d'instance
analysisTextSeoSchema.methods.getScorePercentage = function() {
  return Math.round((this.seoScore / 100) * 100);
};

analysisTextSeoSchema.methods.getNotation = function() {
  return this.baremeResults?.notation || 'Non évalué';
};

analysisTextSeoSchema.methods.getRecommendations = function() {
  return this.baremeResults?.recommandations || [];
};

analysisTextSeoSchema.methods.getCriteresScores = function() {
  if (!this.baremeResults?.criteres) return {};
  
  const scores = {};
  Object.entries(this.baremeResults.criteres).forEach(([key, critere]) => {
    scores[key] = critere.score || 0;
  });
  return scores;
};

// Middleware pre-save pour calculer automatiquement certaines métriques
analysisTextSeoSchema.pre('save', function(next) {
  if (this.isModified('text')) {
    // Calculer les métriques de base
    this.metrics.wordCount = this.text.split(/\s+/).length;
    this.metrics.characterCount = this.text.length;
    this.metrics.paragraphCount = this.text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    this.metrics.averageWordLength = this.metrics.wordCount > 0 
      ? Math.round(this.text.replace(/\s+/g, '').length / this.metrics.wordCount)
      : 0;
  }
  next();
});

// Virtual pour obtenir un résumé de l'analyse
analysisTextSeoSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    textPreview: this.text.substring(0, 100) + '...',
    seoScore: this.seoScore,
    notation: this.getNotation(),
    wordCount: this.metrics.wordCount,
    keywords: this.keywords,
    searchIntent: this.searchIntent,
    createdAt: this.createdAt
  };
});

// Configuration pour inclure les virtuals dans les réponses JSON
analysisTextSeoSchema.set('toJSON', { virtuals: true });
analysisTextSeoSchema.set('toObject', { virtuals: true });

const AnalysisTextSeo = mongoose.model('AnalysisTextSeo', analysisTextSeoSchema);

module.exports = AnalysisTextSeo; 