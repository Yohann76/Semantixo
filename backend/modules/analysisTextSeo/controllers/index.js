const AnalysisTextSeo = require('../models/index');
const { analyzeTextSeo, getBaremeConfiguration, validateBaremeConfiguration } = require('../utils/index');

// Créer une nouvelle analyse de texte SEO
const createAnalysis = async (req, res) => {
  try {
    const { text, keywords = [] } = req.body;
    const userId = req.user.id;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Le texte à analyser est requis et doit être une chaîne de caractères'
      });
    }

    console.log('📊 [CONTROLLER] Début analyse SEO texte:', {
      userId,
      textLength: text.length,
      keywordsCount: keywords.length
    });

    // Analyse SEO avec le nouveau système de barème
    const analysisResults = await analyzeTextSeo(text, keywords);

    if (!analysisResults.success) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'analyse SEO',
        error: analysisResults.error
      });
    }

    // Extraire la thématique
    const topic = analysisResults.baremeResults?.criteria?.keyword_usage?.details?.topicAnalysis?.success ? 
                  analysisResults.baremeResults?.criteria?.keyword_usage?.details?.topicAnalysis?.topic : 
                  'Non détecté';

    // Créer l'analyse dans la base de données
    const analysis = new AnalysisTextSeo({
      userId,
      text,
      seoScore: analysisResults.seoScore,
      metrics: analysisResults.basicMetrics,
      baremeResults: analysisResults.baremeResults,
      keywords,
      topic,
      keywordAnalysis: analysisResults.keywordAnalysis,
      timestamp: new Date()
    });

    await analysis.save();

    console.log('✅ [CONTROLLER] Analyse SEO créée avec succès:', {
      analysisId: analysis._id,
      seoScore: analysisResults.seoScore,
      grade: analysisResults.baremeResults.grade
    });

    res.status(201).json({
      success: true,
      message: 'Analyse SEO créée avec succès',
      data: {
        id: analysis._id,
        text: analysis.text,
        seoScore: analysisResults.seoScore,
        grade: analysisResults.baremeResults.grade,
        topic: topic,
        keywords: analysis.keywords,
        keywordAnalysis: analysisResults.keywordAnalysis,
        metrics: analysisResults.basicMetrics,
        baremeResults: analysisResults.baremeResults,
        timestamp: analysis.timestamp
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

// Récupérer toutes les analyses de l'utilisateur
const getAnalyses = async (req, res) => {
  try {
    const userId = req.user.id;
    const analyses = await AnalysisTextSeo.find({ userId }).sort({ createdAt: -1 });

    console.log('📊 [CONTROLLER] Récupération analyses utilisateur:', {
      userId,
      count: analyses.length
    });

    res.json({
      success: true,
      data: analyses.map(analysis => ({
        id: analysis._id,
        text: analysis.text, // Texte complet au lieu de tronqué
        seoScore: analysis.seoScore,
        grade: analysis.baremeResults?.grade || 'Non évalué',
        topic: analysis.topic,
        keywords: analysis.keywords,
        keywordAnalysis: analysis.keywordAnalysis, // Ajout de l'analyse des mots-clés
        metrics: analysis.metrics,
        baremeResults: analysis.baremeResults,
        timestamp: analysis.createdAt
      }))
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

    const analysis = await AnalysisTextSeo.findOne({ _id: id, userId });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse non trouvée'
      });
    }

    console.log('📊 [CONTROLLER] Récupération analyse spécifique:', {
      analysisId: id,
      userId
    });

    res.json({
      success: true,
      data: {
        id: analysis._id,
        text: analysis.text,
        seoScore: analysis.seoScore,
        grade: analysis.baremeResults?.grade || 'Non évalué',
        topic: analysis.topic,
        keywords: analysis.keywords,
        keywordAnalysis: analysis.keywordAnalysis, // Ajout de l'analyse des mots-clés
        searchIntent: analysis.searchIntent,
        metrics: analysis.metrics,
        baremeResults: analysis.baremeResults,
        timestamp: analysis.createdAt
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

    const analysis = await AnalysisTextSeo.findOneAndDelete({ _id: id, userId });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analyse non trouvée'
      });
    }

    console.log('🗑️ [CONTROLLER] Analyse supprimée:', {
      analysisId: id,
      userId
    });

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

// Obtenir les statistiques des analyses
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const analyses = await AnalysisTextSeo.find({ userId });
    
    if (analyses.length === 0) {
      return res.json({
        success: true,
        data: {
          totalAnalyses: 0,
          averageScore: 0,
          scoreDistribution: {},
          notationDistribution: {},
          topKeywords: [],
          recentActivity: []
        }
      });
    }

    // Calculs statistiques
    const totalAnalyses = analyses.length;
    const averageScore = Math.round(analyses.reduce((sum, a) => sum + a.seoScore, 0) / totalAnalyses);
    
    // Distribution des scores
    const scoreDistribution = {
      '0-20': analyses.filter(a => a.seoScore >= 0 && a.seoScore <= 20).length,
      '21-40': analyses.filter(a => a.seoScore >= 21 && a.seoScore <= 40).length,
      '41-60': analyses.filter(a => a.seoScore >= 41 && a.seoScore <= 60).length,
      '61-80': analyses.filter(a => a.seoScore >= 61 && a.seoScore <= 80).length,
      '81-100': analyses.filter(a => a.seoScore >= 81 && a.seoScore <= 100).length
    };

    // Distribution des notations
    const gradeDistribution = {};
    analyses.forEach(analysis => {
      const grade = analysis.baremeResults?.grade || 'Non évalué';
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
    });

    // Mots-clés les plus utilisés
    const keywordCount = {};
    analyses.forEach(analysis => {
      if (analysis.keywords) {
        analysis.keywords.forEach(keyword => {
          keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
        });
      }
    });
    const topKeywords = Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));

    // Activité récente
    const recentActivity = analyses
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(analysis => ({
        id: analysis._id,
        seoScore: analysis.seoScore,
        grade: analysis.baremeResults?.grade || 'Non évalué',
        timestamp: analysis.createdAt
      }));

    console.log('📊 [CONTROLLER] Statistiques calculées:', {
      userId,
      totalAnalyses,
      averageScore
    });

    res.json({
      success: true,
      data: {
        totalAnalyses,
        averageScore,
        scoreDistribution,
        gradeDistribution,
        topKeywords,
        recentActivity
      }
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur calcul statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul des statistiques',
      error: error.message
    });
  }
};

// Obtenir la configuration du barème
const getBaremeConfig = async (req, res) => {
  try {
    const config = getBaremeConfiguration();
    const validation = validateBaremeConfiguration();

    console.log('⚙️ [CONTROLLER] Configuration barème récupérée');

    res.json({
      success: true,
      data: {
        configuration: config,
        validation
      }
    });

  } catch (error) {
    console.error('❌ [CONTROLLER] Erreur récupération configuration barème:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la configuration',
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
  getBaremeConfig
}; 