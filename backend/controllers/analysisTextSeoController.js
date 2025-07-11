const AnalysisTextSeo = require('../models/AnalysisTextSeo');
const AnalyzerTextSeo = require('../utils/AnalyzerTextSeo');

// @desc    Créer une nouvelle analyse de texte SEO
// @route   POST /api/analysis-text-seo
// @access  Private
const createAnalysisTextSeo = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le texte à analyser est requis'
      });
    }

    if (text.length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Le texte ne peut pas dépasser 10000 caractères'
      });
    }

    // Analyser le texte SEO
    const analysisResult = await AnalyzerTextSeo.analyze(text);

    // Créer l'analyse dans la base de données
    const analysis = await AnalysisTextSeo.create({
      userId: req.user._id,
      text: text,
      seoScore: analysisResult.seoScore,
      metrics: analysisResult.metrics
    });

    console.log('✅ [ANALYSIS] Analyse créée:', analysis._id);

    res.status(201).json({
      success: true,
      message: 'Analyse créée avec succès',
      data: {
        analysis: analysis.toObject()
      }
    });

  } catch (error) {
    console.error('Erreur createAnalysisTextSeo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'analyse'
    });
  }
};

// @desc    Récupérer toutes les analyses de l'utilisateur
// @route   GET /api/analysis-text-seo
// @access  Private
const getAnalysisTextSeo = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Récupérer les analyses avec pagination
    const analyses = await AnalysisTextSeo.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Compter le total d'analyses
    const total = await AnalysisTextSeo.countDocuments({ userId: req.user._id });

    console.log('✅ [ANALYSIS] Analyses récupérées:', analyses.length);

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
    console.error('Erreur getAnalysisTextSeo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des analyses'
    });
  }
};

// @desc    Récupérer une analyse spécifique
// @route   GET /api/analysis-text-seo/:id
// @access  Private
const getAnalysisTextSeoById = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await AnalysisTextSeo.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse non trouvée'
      });
    }

    console.log('✅ [ANALYSIS] Analyse récupérée:', analysis._id);

    res.json({
      success: true,
      data: {
        analysis: analysis.toObject()
      }
    });

  } catch (error) {
    console.error('Erreur getAnalysisTextSeoById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'analyse'
    });
  }
};

// @desc    Supprimer une analyse
// @route   DELETE /api/analysis-text-seo/:id
// @access  Private
const deleteAnalysisTextSeo = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await AnalysisTextSeo.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse non trouvée'
      });
    }

    console.log('✅ [ANALYSIS] Analyse supprimée:', analysis._id);

    res.json({
      success: true,
      message: 'Analyse supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur deleteAnalysisTextSeo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'analyse'
    });
  }
};

// @desc    Obtenir les statistiques des analyses
// @route   GET /api/analysis-text-seo/stats
// @access  Private
const getAnalysisTextSeoStats = async (req, res) => {
  try {
    const totalAnalyses = await AnalysisTextSeo.countDocuments({ userId: req.user._id });
    
    const avgScore = await AnalysisTextSeo.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, avgScore: { $avg: '$seoScore' } } }
    ]);

    const scoreDistribution = await AnalysisTextSeo.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$seoScore', 40] }, then: 'Faible' },
                { case: { $lt: ['$seoScore', 60] }, then: 'Moyen' },
                { case: { $lt: ['$seoScore', 80] }, then: 'Bon' },
                { case: { $gte: ['$seoScore', 80] }, then: 'Excellent' }
              ],
              default: 'Non classé'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('✅ [ANALYSIS] Statistiques récupérées');

    res.json({
      success: true,
      data: {
        totalAnalyses,
        averageScore: avgScore.length > 0 ? Math.round(avgScore[0].avgScore) : 0,
        scoreDistribution
      }
    });

  } catch (error) {
    console.error('Erreur getAnalysisTextSeoStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

module.exports = {
  createAnalysisTextSeo,
  getAnalysisTextSeo,
  getAnalysisTextSeoById,
  deleteAnalysisTextSeo,
  getAnalysisTextSeoStats
}; 