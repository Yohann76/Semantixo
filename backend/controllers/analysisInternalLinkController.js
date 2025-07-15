const AnalysisInternalLink = require('../models/AnalysisInternalLink');
const AnalyzerInternalLink = require('../utils/AnalyzerInternalLink');

// @desc    Créer une nouvelle analyse de maillage interne
// @route   POST /api/analysis-internal-link
// @access  Private
const createAnalysisInternalLink = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || url.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'L\'URL de la page à analyser est requise'
      });
    }

    console.log('🔍 [INTERNAL LINK] Nouvelle analyse demandée pour:', url);

    // Analyser le maillage interne
    const analysisResult = await AnalyzerInternalLink.analyze(url);

    // Créer l'analyse dans la base de données
    const analysis = await AnalysisInternalLink.create({
      userId: req.user._id,
      url: url.trim(),
      internalLinkScore: analysisResult.internalLinkScore,
      metrics: analysisResult.metrics,
      internalLinkElements: analysisResult.internalLinkElements,
      internalPages: analysisResult.internalPages,
      brokenLinks: analysisResult.brokenLinks
    });

    console.log('✅ [INTERNAL LINK] Analyse créée:', analysis._id);

    res.status(201).json({
      success: true,
      message: 'Analyse de maillage interne créée avec succès',
      data: {
        analysis: {
          id: analysis._id,
          url: analysis.url,
          internalLinkScore: analysis.internalLinkScore,
          metrics: analysis.metrics,
          internalLinkElements: analysis.internalLinkElements,
          internalPages: analysis.internalPages,
          brokenLinks: analysis.brokenLinks,
          analysis: analysisResult.analysis,
          createdAt: analysis.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Erreur createAnalysisInternalLink:', error);
    
    // Gérer les erreurs spécifiques
    if (error.message.includes('Impossible d\'accéder') || error.message.includes('temps de réponse')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'analyse de maillage interne'
    });
  }
};

// @desc    Récupérer toutes les analyses de maillage interne de l'utilisateur
// @route   GET /api/analysis-internal-link
// @access  Private
const getAnalysisInternalLink = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Récupérer les analyses avec pagination
    const analyses = await AnalysisInternalLink.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Compter le total d'analyses
    const total = await AnalysisInternalLink.countDocuments({ userId: req.user._id });

    console.log('✅ [INTERNAL LINK] Analyses récupérées:', analyses.length);

    res.json({
      success: true,
      data: {
        analyses: analyses.map(analysis => ({
          id: analysis._id,
          url: analysis.url,
          internalLinkScore: analysis.internalLinkScore,
          metrics: analysis.metrics,
          internalPages: analysis.internalPages,
          brokenLinks: analysis.brokenLinks,
          internalLinkElements: analysis.internalLinkElements,
          analysis: analysis.analysis,
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
    console.error('Erreur getAnalysisInternalLink:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des analyses de maillage interne'
    });
  }
};

// @desc    Récupérer une analyse de maillage interne spécifique
// @route   GET /api/analysis-internal-link/:id
// @access  Private
const getAnalysisInternalLinkById = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await AnalysisInternalLink.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse de maillage interne non trouvée'
      });
    }

    console.log('✅ [INTERNAL LINK] Analyse récupérée:', analysis._id);

    res.json({
      success: true,
      data: {
        analysis: analysis.toObject()
      }
    });

  } catch (error) {
    console.error('Erreur getAnalysisInternalLinkById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'analyse de maillage interne'
    });
  }
};

// @desc    Supprimer une analyse de maillage interne
// @route   DELETE /api/analysis-internal-link/:id
// @access  Private
const deleteAnalysisInternalLink = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await AnalysisInternalLink.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse de maillage interne non trouvée'
      });
    }

    console.log('✅ [INTERNAL LINK] Analyse supprimée:', analysis._id);

    res.json({
      success: true,
      message: 'Analyse de maillage interne supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur deleteAnalysisInternalLink:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'analyse de maillage interne'
    });
  }
};

// @desc    Obtenir les statistiques des analyses de maillage interne
// @route   GET /api/analysis-internal-link/stats
// @access  Private
const getAnalysisInternalLinkStats = async (req, res) => {
  try {
    const totalAnalyses = await AnalysisInternalLink.countDocuments({ userId: req.user._id });
    
    const avgScore = await AnalysisInternalLink.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, avgScore: { $avg: '$internalLinkScore' } } }
    ]);

    const scoreDistribution = await AnalysisInternalLink.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$internalLinkScore', 40] }, then: 'Faible' },
                { case: { $lt: ['$internalLinkScore', 60] }, then: 'Moyen' },
                { case: { $lt: ['$internalLinkScore', 80] }, then: 'Bon' },
                { case: { $gte: ['$internalLinkScore', 80] }, then: 'Excellent' }
              ],
              default: 'Non classé'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('✅ [INTERNAL LINK] Statistiques récupérées');

    res.json({
      success: true,
      data: {
        totalAnalyses,
        averageScore: avgScore.length > 0 ? Math.round(avgScore[0].avgScore) : 0,
        scoreDistribution
      }
    });

  } catch (error) {
    console.error('Erreur getAnalysisInternalLinkStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

module.exports = {
  createAnalysisInternalLink,
  getAnalysisInternalLink,
  getAnalysisInternalLinkById,
  deleteAnalysisInternalLink,
  getAnalysisInternalLinkStats
}; 