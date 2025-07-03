const Analysis = require('../models/Analysis');
const User = require('../models/User');

// @desc    Créer une nouvelle analyse SEO
// @route   POST /api/analysis
// @access  Private
const createAnalysis = async (req, res) => {
  try {
    const { text } = req.body;
    const startTime = Date.now();

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le texte à analyser est requis.'
      });
    }

    // Vérifier la limite pour les utilisateurs gratuits
    const user = await User.findById(req.user._id);
    if (user.subscription === 'free' && user.analysesCount >= 10) {
      return res.status(403).json({
        success: false,
        message: 'Limite d\'analyses atteinte. Passez à la version premium pour plus d\'analyses.'
      });
    }

    // Analyser le texte (logique d'analyse SEO)
    const analysisResult = await analyzeTextSEO(text);
    const processingTime = Date.now() - startTime;

    // Créer l'analyse dans la base de données
    const analysis = await Analysis.create({
      userId: req.user._id,
      text: text.trim(),
      seoScore: analysisResult.seoScore,
      metrics: analysisResult.metrics,
      keywords: analysisResult.keywords,
      suggestions: analysisResult.suggestions,
      status: 'completed',
      processingTime
    });

    // Incrémenter le compteur d'analyses de l'utilisateur
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { analysesCount: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Analyse SEO créée avec succès',
      data: {
        analysis: analysis.toObject()
      }
    });
  } catch (error) {
    console.error('Erreur createAnalysis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de l\'analyse.'
    });
  }
};

// @desc    Obtenir toutes les analyses d'un utilisateur
// @route   GET /api/analysis
// @access  Private
const getAnalyses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-text'); // Exclure le texte pour économiser la bande passante

    const total = await Analysis.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        analyses: analyses.map(analysis => analysis.getSummary()),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur getAnalyses:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des analyses.'
    });
  }
};

// @desc    Obtenir une analyse spécifique
// @route   GET /api/analysis/:id
// @access  Private
const getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse non trouvée.'
      });
    }

    res.json({
      success: true,
      data: {
        analysis: analysis.toObject()
      }
    });
  } catch (error) {
    console.error('Erreur getAnalysis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'analyse.'
    });
  }
};

// @desc    Supprimer une analyse
// @route   DELETE /api/analysis/:id
// @access  Private
const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse non trouvée.'
      });
    }

    // Décrémenter le compteur d'analyses de l'utilisateur
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { analysesCount: -1 }
    });

    res.json({
      success: true,
      message: 'Analyse supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteAnalysis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de l\'analyse.'
    });
  }
};

// Fonction d'analyse SEO (logique métier)
const analyzeTextSEO = async (text) => {
  const words = text.toLowerCase().split(/\s+/);
  const wordCount = words.length;
  const characterCount = text.length;

  // Analyse des mots-clés (simplifiée)
  const keywordMap = {};
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 2) {
      keywordMap[cleanWord] = (keywordMap[cleanWord] || 0) + 1;
    }
  });

  // Calculer la densité des mots-clés
  const keywords = Object.entries(keywordMap)
    .map(([word, count]) => ({
      word,
      count,
      density: (count / wordCount) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Calculer le score de lisibilité (formule simplifiée)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = wordCount / sentences.length;
  const readabilityScore = Math.max(0, 100 - Math.abs(avgWordsPerSentence - 15) * 2);

  // Générer des suggestions
  const suggestions = [];
  if (wordCount < 100) {
    suggestions.push({
      type: 'Ajoutez plus de contenu',
      category: 'content',
      priority: 'high'
    });
  }
  if (avgWordsPerSentence > 25) {
    suggestions.push({
      type: 'Raccourcissez vos phrases',
      category: 'readability',
      priority: 'medium'
    });
  }
  if (keywords.length < 3) {
    suggestions.push({
      type: 'Ajoutez plus de mots-clés pertinents',
      category: 'keyword',
      priority: 'high'
    });
  }

  // Calculer le score SEO global
  const seoScore = Math.round(
    (readabilityScore * 0.3) +
    (Math.min(wordCount / 10, 10) * 0.3) +
    (Math.min(keywords.length * 10, 40) * 0.4)
  );

  return {
    seoScore: Math.min(seoScore, 100),
    metrics: {
      wordCount,
      characterCount,
      keywordDensity: keywords.reduce((sum, k) => sum + k.density, 0) / keywords.length || 0,
      readabilityScore
    },
    keywords,
    suggestions
  };
};

module.exports = {
  createAnalysis,
  getAnalyses,
  getAnalysis,
  deleteAnalysis
}; 