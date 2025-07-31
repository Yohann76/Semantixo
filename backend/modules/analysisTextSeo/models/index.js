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
  baremeResults: {
    totalScore: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      default: 100
    },
    grade: {
      type: String,
      enum: ['Excellent', 'Très bon', 'Bon', 'Moyen', 'Insuffisant'],
      default: 'Non évalué'
    },
    criteria: {
      type: Map,
      of: {
        name: String,
        weight: Number,
        score: Number,
        maxScore: Number,
        details: Object
      }
    },
    recommendations: [{
      criteria: String,
      currentScore: Number,
      maxScore: Number,
      percentage: Number,
      recommendation: String
    }],
    metrics: {
      textStatistics: {
        wordCount: Number,
        characterCount: Number,
        paragraphCount: Number,
        averageWordsPerParagraph: Number
      },
      scoreDistribution: [{
        criteria: String,
        score: Number,
        weight: Number,
        percentage: Number
      }],
      globalPerformance: {
        averageScore: Number,
        excellentCriteria: Number,
        needsImprovement: Number
      }
    },
    scoringVersion: {
      type: String,
      default: '2.3.0'
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
analysisTextSeoSchema.index({ 'baremeResults.grade': 1 });

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

analysisTextSeoSchema.statics.findByGrade = function(userId, grade) {
  return this.find({ 
    userId, 
    'baremeResults.grade': grade 
  }).sort({ createdAt: -1 });
};

// Méthodes d'instance
analysisTextSeoSchema.methods.getScorePercentage = function() {
  return Math.round((this.seoScore / 100) * 100);
};

analysisTextSeoSchema.methods.getGrade = function() {
  return this.baremeResults?.grade || 'Non évalué';
};

analysisTextSeoSchema.methods.getRecommendations = function() {
  return this.baremeResults?.recommendations || [];
};

analysisTextSeoSchema.methods.getCriteriaScores = function() {
  if (!this.baremeResults?.criteria) return {};
  
  const scores = {};
  this.baremeResults.criteria.forEach((value, key) => {
    scores[key] = value.score || 0;
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
    grade: this.getGrade(),
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