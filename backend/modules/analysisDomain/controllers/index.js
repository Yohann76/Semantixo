const AnalysisDomain = require('../models');
const AnalyzerDomain = require('../utils');

// @desc    Créer une nouvelle analyse de nom de domaine
// @route   POST /api/analysis-domain
// @access  Private
const createAnalysisDomain = async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain || domain.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le nom de domaine est requis'
      });
    }

    console.log('🔍 [DOMAIN] Nouvelle analyse demandée pour:', domain);

    // Analyser le nom de domaine
    const analysis = await AnalyzerDomain.analyze(domain);

    // Créer l'analyse dans la base de données
    const analysisDb = await AnalysisDomain.create({
      userId: req.user._id,
      domain: domain.trim(),
      domainScore: analysis.domainScore,
      metrics: analysis.metrics,
      domainElements: analysis.domainElements,
      analysis: analysis.analysis
    });

    console.log('✅ [DOMAIN] Analyse créée:', analysisDb._id);

    res.status(201).json({
      success: true,
      message: 'Analyse de nom de domaine créée avec succès',
      data: {
        id: analysisDb._id,
        domain: analysisDb.domain,
        seoScore: analysisDb.domainScore, // Renommé pour cohérence
        metrics: analysisDb.metrics,
        domainElements: analysisDb.domainElements,
        analysis: analysisDb.analysis,
        createdAt: analysisDb.createdAt,
        type: 'domain' // Ajouté pour l'historique
      }
    });

  } catch (error) {
    console.error('Erreur createAnalysisDomain:', error);
    
    // Gérer les erreurs spécifiques
    if (error.message.includes('Impossible d\'accéder') || error.message.includes('temps de réponse')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'analyse de nom de domaine'
    });
  }
};

// @desc    Récupérer toutes les analyses de noms de domaine de l'utilisateur
// @route   GET /api/analysis-domain
// @access  Private
const getAnalysisDomain = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Récupérer les analyses avec pagination
    const analyses = await AnalysisDomain.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Compter le total d'analyses
    const total = await AnalysisDomain.countDocuments({ userId: req.user._id });

    console.log('✅ [DOMAIN] Analyses récupérées:', analyses.length);

    res.json({
      success: true,
      data: analyses.map(analysis => ({
        id: analysis._id,
        domain: analysis.domain,
        seoScore: analysis.domainScore, // Renommé pour cohérence
        metrics: analysis.metrics,
        domainElements: analysis.domainElements,
        analysis: analysis.analysis,
        createdAt: analysis.createdAt,
        type: 'domain' // Ajouté pour l'historique
      }))
    });

  } catch (error) {
    console.error('Erreur getAnalysisDomain:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des analyses de noms de domaine'
    });
  }
};

// @desc    Récupérer une analyse de nom de domaine spécifique
// @route   GET /api/analysis-domain/:id
// @access  Private
const getAnalysisDomainById = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await AnalysisDomain.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse de nom de domaine non trouvée'
      });
    }

    console.log('✅ [DOMAIN] Analyse récupérée:', analysis._id);

    res.json({
      success: true,
      data: {
        id: analysis._id,
        domain: analysis.domain,
        seoScore: analysis.domainScore, // Renommé pour cohérence
        metrics: analysis.metrics,
        domainElements: analysis.domainElements,
        analysis: analysis.analysis,
        createdAt: analysis.createdAt,
        type: 'domain' // Ajouté pour l'historique
      }
    });

  } catch (error) {
    console.error('Erreur getAnalysisDomainById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'analyse de nom de domaine'
    });
  }
};

// @desc    Supprimer une analyse de nom de domaine
// @route   DELETE /api/analysis-domain/:id
// @access  Private
const deleteAnalysisDomain = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await AnalysisDomain.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse de nom de domaine non trouvée'
      });
    }

    console.log('✅ [DOMAIN] Analyse supprimée:', analysis._id);

    res.json({
      success: true,
      message: 'Analyse de nom de domaine supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur deleteAnalysisDomain:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'analyse de nom de domaine'
    });
  }
};

// @desc    Obtenir les statistiques des analyses de noms de domaine
// @route   GET /api/analysis-domain/stats
// @access  Private
const getAnalysisDomainStats = async (req, res) => {
  try {
    const totalAnalyses = await AnalysisDomain.countDocuments({ userId: req.user._id });
    
    const avgScore = await AnalysisDomain.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, avgScore: { $avg: '$domainScore' } } }
    ]);

    const scoreDistribution = await AnalysisDomain.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$domainScore', 40] }, then: 'Faible' },
                { case: { $lt: ['$domainScore', 60] }, then: 'Moyen' },
                { case: { $lt: ['$domainScore', 80] }, then: 'Bon' },
                { case: { $gte: ['$domainScore', 80] }, then: 'Excellent' }
              ],
              default: 'Non classé'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('✅ [DOMAIN] Statistiques récupérées');

    res.json({
      success: true,
      data: {
        totalAnalyses,
        averageScore: avgScore.length > 0 ? Math.round(avgScore[0].avgScore) : 0,
        scoreDistribution
      }
    });

  } catch (error) {
    console.error('Erreur getAnalysisDomainStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

module.exports = {
  createAnalysisDomain,
  getAnalysisDomain,
  getAnalysisDomainById,
  deleteAnalysisDomain,
  getAnalysisDomainStats
}; 