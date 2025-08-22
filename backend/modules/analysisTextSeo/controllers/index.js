const { AnalysisTextSeo } = require('../models');
const AnalysisAggregationService = require('../services/AnalysisAggregationService');
const { startTextAnalysis } = require('../jobs');

// ===== NOUVELLE ARCHITECTURE =====

/**
 * Créer une nouvelle analyse de texte SEO
 */
const createAnalysis = async (req, res) => {
  console.log('🔥 [CONTROLLER] createAnalysis called!');
  console.log('🔥 [CONTROLLER] req.body:', JSON.stringify(req.body, null, 2));
  console.log('🔥 [CONTROLLER] req.user:', req.user ? 'Present' : 'NULL');
  
  try {
    const { text, keywords = [] } = req.body;
    const userId = req.user.id;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Le texte à analyser est requis et doit être une chaîne de caractères'
      });
    }

    // Créer l'analyse avec le nouveau modèle léger
    const analysis = new AnalysisTextSeo({
      user_id: userId,
      parameter: {
        text,
        keywords
      },
      status: 'processing',
      scoreSeo: 0,
      progress: 0
    });

    await analysis.save();

    // Démarrer l'analyse asynchrone avec BullMQ
    await startTextAnalysis(analysis._id, text, keywords);

    console.log(`✅ [CONTROLLER] Analyse créée avec ID: ${analysis._id}`);

    // Retourner la vue d'ensemble
    const overview = await AnalysisAggregationService.getAnalysisOverview(analysis._id, userId);
    
    res.status(201).json({
      success: true,
      message: 'Analyse créée avec succès',
      data: overview
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur création analyse:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'analyse',
      error: error.message
    });
  }
};

/**
 * Obtenir une vue d'ensemble d'une analyse (métadonnées + résumé jobs)
 */
const getAnalysisOverview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const overview = await AnalysisAggregationService.getAnalysisOverview(id, userId);
    
    res.json({
      success: true,
      data: overview
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur récupération overview:', error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtenir une analyse complète (métadonnées + détails complets des jobs)
 */
const getAnalysisComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const complete = await AnalysisAggregationService.getAnalysisComplete(id, userId);
    
    res.json({
      success: true,
      data: complete
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur récupération complète:', error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtenir les détails d'un job spécifique
 */
const getJobDetails = async (req, res) => {
  try {
    const { id, jobType } = req.params;
    const userId = req.user.id;

    const jobDetails = await AnalysisAggregationService.getJobDetails(id, jobType, userId);
    
    res.json({
      success: true,
      data: jobDetails
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur récupération job:', error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtenir la liste des analyses pour l'historique (vue rapide)
 */
const getAnalysesList = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await AnalysisAggregationService.getAnalysesList(userId, page, limit);
    
    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur récupération liste:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des analyses',
      error: error.message
    });
  }
};

/**
 * Supprimer une analyse
 */
const deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier que l'analyse appartient à l'utilisateur
    const analysis = await AnalysisTextSeo.findOne({ _id: id, user_id: userId });
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse non trouvée'
      });
    }

    // Supprimer l'analyse principale
    await AnalysisTextSeo.findByIdAndDelete(id);

    // Supprimer tous les jobs associés
    const { KeywordAnalysisJob, KeywordPositionJob, ContentLengthJob, ReadabilityJob, UniquenessJob } = require('../models');
    await Promise.all([
      KeywordAnalysisJob.deleteMany({ analysisId: id }),
      KeywordPositionJob.deleteMany({ analysisId: id }),
      ContentLengthJob.deleteMany({ analysisId: id }),
      ReadabilityJob.deleteMany({ analysisId: id }),
      UniquenessJob.deleteMany({ analysisId: id })
    ]);

    res.json({
      success: true,
      message: 'Analyse supprimée avec succès'
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur suppression:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};

/**
 * Obtenir les statistiques générales
 */
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await AnalysisTextSeo.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: null,
          totalAnalyses: { $sum: 1 },
          completedAnalyses: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          avgScore: { $avg: '$scoreSeo' },
          maxScore: { $max: '$scoreSeo' },
          minScore: { $min: '$scoreSeo' }
        }
      }
    ]);

    const result = stats[0] || {
      totalAnalyses: 0,
      completedAnalyses: 0,
      avgScore: 0,
      maxScore: 0,
      minScore: 0
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

/**
 * Obtenir la configuration des jobs disponibles
 */
const getJobsConfig = async (req, res) => {
  try {
    const config = AnalysisTextSeo.getJobsConfig();
    
    res.json({
      success: true,
      data: config
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur config jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la configuration',
      error: error.message
    });
  }
};

// ===== COMPATIBILITÉ TEMPORAIRE =====

/**
 * @deprecated Utiliser getAnalysisOverview à la place
 * Endpoint de compatibilité temporaire
 */
const getAnalysisStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Rediriger vers la nouvelle méthode
    const overview = await AnalysisAggregationService.getAnalysisOverview(id, userId);
    
    // Formater pour l'ancien format attendu par le frontend
    const legacyFormat = {
      id: overview.id,
      user_id: overview.user_id,
      status: overview.status,
      seoScore: overview.scoreSeo,
      notation: overview.notation,
      progress: overview.progress,
      parameter: overview.parameter,
      createdAt: overview.createdAt,
      text: overview.parameter?.text,
      keywords: overview.parameter?.keywords,
      topic: 'Non détecté', // Placeholder
      // Simuler l'ancien format jobs pour compatibilité
      jobs: overview.jobsSummary?.map(job => ({
        name: job.type,
        poidScoreSEO: job.weight,
        status: job.status,
        info: {
          score: job.score,
          details: `Status: ${job.status}`,
          metrics: {},
          recommendations: []
        }
      })) || []
    };
    
    res.json({
      success: true,
      data: legacyFormat
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur status (legacy):', error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  // Nouvelle architecture
  createAnalysis,
  getAnalysisOverview,
  getAnalysisComplete,
  getJobDetails,
  getAnalysesList,
  deleteAnalysis,
  getStats,
  getJobsConfig,
  // Compatibilité temporaire
  getAnalysisStatus
};