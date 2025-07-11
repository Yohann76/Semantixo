const AnalysisPageSeo = require('../models/AnalysisPageSeo');
const AnalyzerPageSeo = require('../utils/AnalyzerPageSeo');

// @desc    Créer une nouvelle analyse de page SEO
// @route   POST /api/analysis-page-seo
// @access  Private
const createAnalysisPageSeo = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || url.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'L\'URL de la page à analyser est requise'
      });
    }

    console.log('🔍 [PAGE SEO] Nouvelle analyse demandée pour:', url);

    // Analyser la page SEO
    const analysisResult = await AnalyzerPageSeo.analyze(url);

    // Créer l'analyse dans la base de données
    const analysis = await AnalysisPageSeo.create({
      userId: req.user._id,
      url: url.trim(),
      pageTitle: analysisResult.pageTitle,
      metaDescription: analysisResult.metaDescription,
      seoScore: analysisResult.seoScore,
      metrics: analysisResult.metrics,
      seoElements: analysisResult.seoElements
    });

    console.log('✅ [PAGE SEO] Analyse créée:', analysis._id);

    res.status(201).json({
      success: true,
      message: 'Analyse de page créée avec succès',
      data: {
        analysis: {
          id: analysis._id,
          url: analysis.url,
          pageTitle: analysis.pageTitle,
          metaDescription: analysis.metaDescription,
          seoScore: analysis.seoScore,
          metrics: analysis.metrics,
          seoElements: analysis.seoElements,
          analysis: analysisResult.analysis,
          createdAt: analysis.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Erreur createAnalysisPageSeo:', error);
    
    // Gérer les erreurs spécifiques
    if (error.message.includes('Impossible d\'accéder') || error.message.includes('temps de réponse')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'analyse de page'
    });
  }
};

// @desc    Récupérer toutes les analyses de page de l'utilisateur
// @route   GET /api/analysis-page-seo
// @access  Private
const getAnalysisPageSeo = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Récupérer les analyses avec pagination
    const analyses = await AnalysisPageSeo.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Compter le total d'analyses
    const total = await AnalysisPageSeo.countDocuments({ userId: req.user._id });

    console.log('✅ [PAGE SEO] Analyses récupérées:', analyses.length);

    res.json({
      success: true,
      data: {
        analyses: analyses.map(analysis => ({
          id: analysis._id,
          url: analysis.url,
          pageTitle: analysis.pageTitle,
          seoScore: analysis.seoScore,
          wordCount: analysis.metrics.wordCount,
          characterCount: analysis.metrics.characterCount,
          headingCount: analysis.metrics.headingCount,
          imageCount: analysis.metrics.imageCount,
          linkCount: analysis.metrics.linkCount,
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
    console.error('Erreur getAnalysisPageSeo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des analyses de page'
    });
  }
};

// @desc    Récupérer une analyse de page spécifique
// @route   GET /api/analysis-page-seo/:id
// @access  Private
const getAnalysisPageSeoById = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await AnalysisPageSeo.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse de page non trouvée'
      });
    }

    console.log('✅ [PAGE SEO] Analyse récupérée:', analysis._id);

    res.json({
      success: true,
      data: {
        analysis: analysis.toObject()
      }
    });

  } catch (error) {
    console.error('Erreur getAnalysisPageSeoById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'analyse de page'
    });
  }
};

// @desc    Supprimer une analyse de page
// @route   DELETE /api/analysis-page-seo/:id
// @access  Private
const deleteAnalysisPageSeo = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await AnalysisPageSeo.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse de page non trouvée'
      });
    }

    console.log('✅ [PAGE SEO] Analyse supprimée:', analysis._id);

    res.json({
      success: true,
      message: 'Analyse de page supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur deleteAnalysisPageSeo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'analyse de page'
    });
  }
};

// @desc    Obtenir les statistiques des analyses de page
// @route   GET /api/analysis-page-seo/stats
// @access  Private
const getAnalysisPageSeoStats = async (req, res) => {
  try {
    const totalAnalyses = await AnalysisPageSeo.countDocuments({ userId: req.user._id });
    
    const avgScore = await AnalysisPageSeo.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, avgScore: { $avg: '$seoScore' } } }
    ]);

    const scoreDistribution = await AnalysisPageSeo.aggregate([
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

    console.log('✅ [PAGE SEO] Statistiques récupérées');

    res.json({
      success: true,
      data: {
        totalAnalyses,
        averageScore: avgScore.length > 0 ? Math.round(avgScore[0].avgScore) : 0,
        scoreDistribution
      }
    });

  } catch (error) {
    console.error('Erreur getAnalysisPageSeoStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

module.exports = {
  createAnalysisPageSeo,
  getAnalysisPageSeo,
  getAnalysisPageSeoById,
  deleteAnalysisPageSeo,
  getAnalysisPageSeoStats
}; 