const mongoose = require('mongoose');

// Modèle pour l'analyse de texte SEO avec structure JSON personnalisée
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
  jobs: [
    {
      name: {
        type: String,
        enum: ['keyword-analysis', 'keyword-position', 'content-length', 'readability', 'uniqueness']
      },
      poidScoreSEO: {
        type: Number,
        default: function() {
          const weights = {
            'keyword-analysis': 40,
            'keyword-position': 15, 
            'content-length': 15,
            'readability': 15,
            'uniqueness': 15
          };
          return weights[this.name] || 0;
        }
      },
      status: {
        type: String,
        enum: ['waiting', 'processing', 'completed', 'failed'],
        default: 'waiting'
      },
      info: {
        score: { type: Number, default: 0 },
        details: { type: String, default: 'En attente de traitement' },
        startedAt: Date,
        completedAt: Date,
        processingTime: Number,
        error: String,
        // Informations spécifiques pour l'historique et stats
        metrics: {
          keywordDensity: Number,
          wordCount: Number,
          readabilityScore: Number,
          uniquenessPercentage: Number,
          positionScore: Number
        },
        recommendations: [String]
      }
    }
  ]
}, {
  timestamps: true
});

// Initialiser les jobs par défaut avec la structure souhaitée
AnalysisTextSeoSchema.methods.initializeJobs = function() {
  this.jobs = [
    {
      name: 'keyword-analysis',
      poidScoreSEO: 40,
      status: 'waiting',
      info: { 
        score: 0, 
        details: 'En attente d\'analyse des mots-clés',
        metrics: {},
        recommendations: []
      }
    },
    {
      name: 'keyword-position', 
      poidScoreSEO: 15,
      status: 'waiting',
      info: { 
        score: 0, 
        details: 'En attente d\'analyse de position des mots-clés',
        metrics: {},
        recommendations: []
      }
    },
    {
      name: 'content-length',
      poidScoreSEO: 15,
      status: 'waiting',
      info: { 
        score: 0, 
        details: 'En attente d\'analyse de longueur du contenu',
        metrics: {},
        recommendations: []
      }
    },
    {
      name: 'readability',
      poidScoreSEO: 15,
      status: 'waiting',
      info: { 
        score: 0, 
        details: 'En attente d\'analyse de lisibilité',
        metrics: {},
        recommendations: []
      }
    },
    {
      name: 'uniqueness',
      poidScoreSEO: 15,
      status: 'waiting',
      info: { 
        score: 0, 
        details: 'En attente d\'analyse d\'originalité',
        metrics: {},
        recommendations: []
      }
    }
  ];
};

// Calculer le score global SEO
AnalysisTextSeoSchema.methods.calculateScoreSeo = function() {
  let totalScore = 0;
  
  this.jobs.forEach(job => {
    if (job.status === 'completed') {
      const weight = job.poidScoreSEO || 0; // Utilise le poids numérique du job
      const score = job.info.score || 0;
      totalScore += score * (weight / 100); // Divise par 100 pour convertir le pourcentage
    }
  });
  
  this.scoreSeo = Math.round(totalScore);
  
  // Retourner le score calculé
  return this.scoreSeo;
};

module.exports = mongoose.model('AnalysisTextSeo', AnalysisTextSeoSchema);