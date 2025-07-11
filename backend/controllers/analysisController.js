const Analysis = require('../models/Analysis');
const User = require('../models/User');

// @desc    Créer une nouvelle analyse SEO
// @route   POST /api/analysis
// @access  Private
const createAnalysis = async (req, res) => {
  try {
    const { text } = req.body;

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

    // Analyser le texte (logique d'analyse SEO simplifiée)
    const analysisResult = await analyzeTextSEO(text);

    // Créer l'analyse dans la base de données
    const analysis = await Analysis.create({
      userId: req.user._id,
      text: text.trim(),
      seoScore: analysisResult.seoScore,
      metrics: analysisResult.metrics
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
      .select('text seoScore metrics createdAt'); // Inclure le texte pour l'historique

    const total = await Analysis.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: {
        analyses: analyses.map(analysis => ({
          id: analysis._id,
          text: analysis.text,
          seoScore: analysis.seoScore,
          wordCount: analysis.metrics.wordCount,
          characterCount: analysis.metrics.characterCount,
          createdAt: analysis.createdAt
        })),
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

// Fonction d'analyse SEO simplifiée
const analyzeTextSEO = async (text) => {
  const words = text.toLowerCase().split(/\s+/);
  const wordCount = words.length;
  const characterCount = text.length;

  // Calculer le score SEO basique
  const seoScore = Math.round(
    Math.min(wordCount / 10, 50) + // Score basé sur la longueur
    Math.min(characterCount / 100, 50) // Score basé sur les caractères
  );

  return {
    seoScore: Math.min(seoScore, 100),
    metrics: {
      wordCount,
      characterCount
    }
  };
};

module.exports = {
  createAnalysis,
  getAnalyses,
  getAnalysis,
  deleteAnalysis
}; 