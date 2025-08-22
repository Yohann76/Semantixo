const AnalysisTextSeo = require('../models/AnalysisTextSeo');

// Helper pour obtenir le nom d'affichage des jobs
const getJobDisplayName = (jobName) => {
  const names = {
    'keyword-analysis': 'Analyse des mots-clés',
    'keyword-position': 'Position des mots-clés', 
    'content-length': 'Longueur du contenu',
    'readability': 'Lisibilité',
    'uniqueness': 'Originalité'
  };
  return names[jobName] || jobName;
};

// Créer une nouvelle analyse de texte SEO
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



    // Créer l'analyse avec le modèle AnalysisTextSeo
    const analysis = new AnalysisTextSeo({
      user_id: userId,
      parameter: {
        text,
        keywords
      },
      status: 'processing',
      scoreSeo: 0
    });

    // Initialiser les jobs
    analysis.initializeJobs();
    await analysis.save();



    const { startTextAnalysis } = require('../jobs');
    

    const jobsResult = await startTextAnalysis(analysis._id.toString(), text, keywords);



    res.status(201).json({
      success: true,
      message: 'Analyse SEO démarrée avec succès',
      data: {
        id: analysis._id,
        request_id: analysis.request_id,
        user_id: analysis.user_id,
        parameter: analysis.parameter,
        // Données directes pour compatibilité frontend
        text: analysis.parameter?.text || '',
        keywords: analysis.parameter?.keywords || [],
        status: analysis.status,
        scoreSeo: analysis.scoreSeo,
        seoScore: analysis.scoreSeo,
        notation: analysis.scoreSeo >= 80 ? 'Excellent' : 
                 analysis.scoreSeo >= 60 ? 'Bon' : 
                 analysis.scoreSeo >= 40 ? 'Moyen' : 'À améliorer',
        progress: 0,
        timestamp: analysis.createdAt,
        createdAt: analysis.createdAt,
        jobs: analysis.jobs.map(job => ({
          name: job.name,
          poidScoreSEO: job.poidScoreSEO,
          status: job.status,
          score: job.info?.score || 0,
          info: job.info
        })),
        // Vue simplifiée des jobs avec poids et scores
        jobsSimplified: {
          totalPoids: analysis.jobs.reduce((total, job) => total + (job.poidScoreSEO || 0), 0),
          scoreTotal: analysis.scoreSeo,
          details: analysis.jobs.map(job => ({
            name: job.name,
            displayName: getJobDisplayName(job.name),
            poids: job.poidScoreSEO,
            score: job.info?.score || 0,
            status: job.status,
            contribution: job.status === 'completed' ? 
              Math.round((job.info?.score || 0) * (job.poidScoreSEO / 100)) : 0
          }))
        },
        estimatedTime: '10-30 secondes'
      }
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

const getAnalyses = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const analyses = await AnalysisTextSeo.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AnalysisTextSeo.countDocuments({ user_id: userId });

    const formattedAnalyses = analyses.map(analysis => ({
      id: analysis._id, // Frontend utilise 'id'
      request_id: analysis.request_id,
      status: analysis.status,
      scoreSeo: analysis.scoreSeo,
      seoScore: analysis.scoreSeo, // Compatibilité frontend
      notation: analysis.scoreSeo >= 80 ? 'Excellent' : 
               analysis.scoreSeo >= 60 ? 'Bon' : 
               analysis.scoreSeo >= 40 ? 'Moyen' : 'À améliorer',
      // Données directes pour compatibilité frontend
      text: analysis.parameter?.text || '',
      keywords: analysis.parameter?.keywords || [],
      parameter: analysis.parameter,
      jobs: analysis.jobs,
      timestamp: analysis.createdAt,
      createdAt: analysis.createdAt,
      type: 'text' // Type pour l'historique
    }));

    res.json({
      success: true,
      data: formattedAnalyses, // Directement le tableau pour l'historique
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAnalyses: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur récupération analyses:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des analyses',
      error: error.message
    });
  }
};

// Récupérer une analyse spécifique
const getAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const analysis = await AnalysisTextSeo.findOne({
      _id: id,
      user_id: userId
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse non trouvée'
      });
    }

    res.json({
      success: true,
      data: {
        request_id: analysis.request_id,
        user_id: analysis.user_id,
        parameter: analysis.parameter,
        status: analysis.status,
        scoreSeo: analysis.scoreSeo,
        jobs: analysis.jobs,
        createdAt: analysis.createdAt,
        updatedAt: analysis.updatedAt
      }
    });
  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur récupération analyse:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'analyse',
      error: error.message
    });
  }
};

// Supprimer une analyse
const deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const analysis = await AnalysisTextSeo.findOneAndDelete({
      _id: id,
      user_id: userId
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Analyse supprimée avec succès'
    });
  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur suppression analyse:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'analyse',
      error: error.message
    });
  }
};

// Obtenir les statistiques
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalAnalyses = await AnalysisTextSeo.countDocuments({ user_id: userId });
    const completedAnalyses = await AnalysisTextSeo.countDocuments({ 
      user_id: userId, 
      status: 'completed' 
    });
    const processingAnalyses = await AnalysisTextSeo.countDocuments({ 
      user_id: userId, 
      status: 'processing' 
    });

    // Score moyen
    const completedAnalysesWithScore = await AnalysisTextSeo.find({
      user_id: userId,
      status: 'completed',
      scoreSeo: { $gt: 0 }
    });

    const averageScore = completedAnalysesWithScore.length > 0
      ? completedAnalysesWithScore.reduce((sum, analysis) => sum + analysis.scoreSeo, 0) / completedAnalysesWithScore.length
      : 0;

    res.json({
      success: true,
      data: {
        totalAnalyses,
        completedAnalyses,
        processingAnalyses,
        averageScore: Math.round(averageScore)
      }
    });
  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur récupération stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// Obtenir le statut d'une analyse (pour le polling)
const getAnalysisStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const analysis = await AnalysisTextSeo.findOne({
      _id: id,
      user_id: userId
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse non trouvée'
      });
    }

    // Calculer le progrès et les métriques
    const completedJobsArray = analysis.jobs.filter(job => job.status === 'completed');
    const failedJobs = analysis.jobs.filter(job => job.status === 'failed');
    const totalJobs = analysis.jobs.length;
    const progress = totalJobs > 0 ? Math.round((completedJobsArray.length / totalJobs) * 100) : 0;
    
    // Extraire les métriques des jobs
    const keywordJob = analysis.jobs.find(job => job.name === 'keyword-analysis');
    const contentJob = analysis.jobs.find(job => job.name === 'content-length');
    const readabilityJob = analysis.jobs.find(job => job.name === 'readability');
    
    const wordCount = contentJob?.info?.metrics?.wordCount || 0;
    const charCount = analysis.parameter?.text?.length || 0;
    const paragraphCount = analysis.parameter?.text?.split('\n\n').length || 1;

    res.json({
      success: true,
      data: {
        id: analysis._id,
        request_id: analysis.request_id,
        user_id: analysis.user_id,
        parameter: analysis.parameter,
        // Données directes pour compatibilité frontend
        text: analysis.parameter?.text || '',
        keywords: analysis.parameter?.keywords || [],
        topic: keywordJob?.info?.metrics?.detectedTopic || 'Non détecté',
        status: analysis.status,
        scoreSeo: analysis.scoreSeo,
        seoScore: analysis.scoreSeo,
        notation: analysis.scoreSeo >= 80 ? 'Excellent' : 
                 analysis.scoreSeo >= 60 ? 'Bon' : 
                 analysis.scoreSeo >= 40 ? 'Moyen' : 'À améliorer',
        progress,
        timestamp: analysis.createdAt,
        createdAt: analysis.createdAt,
        // Structure baremeResults pour métriques détaillées
        baremeResults: {
          bareme_version: '1.0.0',
          score_global: analysis.scoreSeo,
          metriques: {
            statistiques_texte: {
              nombre_mots: wordCount,
              nombre_caracteres: charCount,
              nombre_paragraphes: paragraphCount,
              longueur_moyenne_paragraphe: paragraphCount > 0 ? Math.round(wordCount / paragraphCount) : 0
            },
            performance_globale: {
              score_moyen: Math.round(analysis.scoreSeo),
              criteres_excellents: completedJobsArray.filter(job => (job.info?.score || 0) >= 80).length,
              criteres_a_ameliorer: completedJobsArray.filter(job => (job.info?.score || 0) < 60).length
            }
          }
        },
        jobs: analysis.jobs.map(job => ({
          name: job.name,
          poidScoreSEO: job.poidScoreSEO,
          status: job.status,
          score: job.info?.score || 0,
          info: job.info
        })),
        // Vue simplifiée des jobs avec poids et scores
        jobsSimplified: {
          totalPoids: analysis.jobs.reduce((total, job) => total + (job.poidScoreSEO || 0), 0),
          scoreTotal: analysis.scoreSeo,
          details: analysis.jobs.map(job => ({
            name: job.name,
            displayName: getJobDisplayName(job.name),
            poids: job.poidScoreSEO,
            score: job.info?.score || 0,
            status: job.status,
            contribution: job.status === 'completed' ? 
              Math.round((job.info?.score || 0) * (job.poidScoreSEO / 100)) : 0
          }))
        }
      }
    });
  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur statut analyse:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du statut',
      error: error.message
    });
  }
};

// Obtenir la configuration des jobs disponibles
const getJobsConfig = async (req, res) => {
  try {
    const jobsConfig = {
      KeywordAnalysis: {
        name: 'KeywordAnalysis',
        displayName: 'Analyse des mots-clés',
        description: 'Analyse la densité et la pertinence des mots-clés dans le texte',
        poidScoreSEO: '40%',
        weight: 40,
        estimatedTime: '5-10s'
      },
      KeywordPosition: {
        name: 'KeywordPosition',
        displayName: 'Position des mots-clés',
        description: 'Vérifie la position optimale des mots-clés dans le contenu',
        poidScoreSEO: '15%',
        weight: 15,
        estimatedTime: '3-5s'
      },
      ContentLength: {
        name: 'ContentLength',
        displayName: 'Longueur du contenu',
        description: 'Évalue si la longueur du contenu est optimale pour le SEO',
        poidScoreSEO: '15%',
        weight: 15,
        estimatedTime: '1-2s'
      },
      Readability: {
        name: 'Readability',
        displayName: 'Lisibilité',
        description: 'Analyse la facilité de lecture et la structure du texte',
        poidScoreSEO: '15%',
        weight: 15,
        estimatedTime: '3-5s'
      },
      Uniqueness: {
        name: 'Uniqueness',
        displayName: 'Originalité',
        description: 'Vérifie l\'originalité et l\'absence de contenu dupliqué',
        poidScoreSEO: '15%',
        weight: 15,
        estimatedTime: '5-8s'
      }
    };

    res.json({
      success: true,
      data: {
        availableJobs: Object.values(jobsConfig),
        totalJobs: Object.keys(jobsConfig).length,
        totalWeight: 100,
        estimatedTotalTime: '17-30 secondes'
      }
    });
  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur config jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la configuration des jobs',
      error: error.message
    });
  }
};

module.exports = {
  createAnalysis,
  getAnalyses,
  getAnalysis,
  deleteAnalysis,
  getStats,
  getAnalysisStatus,
  getJobsConfig
};