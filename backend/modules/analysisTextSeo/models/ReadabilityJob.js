const mongoose = require('mongoose');

const ReadabilityJobSchema = new mongoose.Schema({
  // Référence vers l'analyse principale
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalysisTextSeo',
    required: true
  },
  
  // Métadonnées du job
  jobName: {
    type: String,
    default: 'readability',
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
  
  // Métriques SEO complètes pour la lisibilité
  metrics: {
    // Scores de lisibilité
    fleschReadingEase: Number, // Score Flesch (0-100)
    fleschKincaidGrade: Number, // Niveau scolaire US
    gunningFogIndex: Number, // Indice de brouillard
    smogIndex: Number, // Indice SMOG
    
    // Métriques de structure
    avgSentenceLength: Number, // Mots par phrase
    avgWordsPerParagraph: Number, // Mots par paragraphe
    avgSyllablesPerWord: Number, // Syllabes par mot
    complexWordsCount: Number, // Mots complexes (3+ syllabes)
    complexWordsPercentage: Number, // % de mots complexes
    
    // Métriques de longueur (intégrées de content-length)
    wordCount: Number,
    characterCount: Number,
    sentenceCount: Number,
    paragraphCount: Number,
    contentLengthScore: Number, // Score sur 5 points pour la longueur
    
    // Métriques SEO avancées
    readabilityScore: Number, // Score global sur 10 points
    seoReadabilityGrade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
    },
    
    // Analyse des phrases
    sentenceAnalysis: {
      shortSentences: Number, // < 15 mots
      mediumSentences: Number, // 15-25 mots
      longSentences: Number, // > 25 mots
      veryLongSentences: Number // > 40 mots
    },
    
    // Analyse des paragraphes
    paragraphAnalysis: {
      shortParagraphs: Number, // < 50 mots
      mediumParagraphs: Number, // 50-150 mots
      longParagraphs: Number, // > 150 mots
      optimalParagraphs: Number // 100-150 mots
    },
    
    // Recommandations spécifiques
    issues: [String], // Problèmes détectés
    strengths: [String] // Points forts
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
ReadabilityJobSchema.index({ analysisId: 1, status: 1 });
ReadabilityJobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ReadabilityJob', ReadabilityJobSchema);
