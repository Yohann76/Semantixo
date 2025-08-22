const express = require('express');
const router = express.Router();
const { protect } = require('../../../middleware/auth');
const {
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
} = require('../controllers');

// Routes protégées par authentification
router.use(protect);

// ===== NOUVELLE ARCHITECTURE =====

// POST /api/analysis-text-seo - Créer une nouvelle analyse
router.post('/', createAnalysis);

// GET /api/analysis-text-seo - Liste des analyses (vue rapide pour historique)
router.get('/', getAnalysesList);

// GET /api/analysis-text-seo/:id - Vue d'ensemble d'une analyse (métadonnées + résumé jobs)
router.get('/:id', getAnalysisOverview);

// GET /api/analysis-text-seo/:id/complete - Analyse complète (métadonnées + détails complets des jobs)
router.get('/:id/complete', getAnalysisComplete);

// GET /api/analysis-text-seo/:id/jobs/:jobType - Détails d'un job spécifique
router.get('/:id/jobs/:jobType', getJobDetails);

// DELETE /api/analysis-text-seo/:id - Supprimer une analyse
router.delete('/:id', deleteAnalysis);

// GET /api/analysis-text-seo/stats - Obtenir les statistiques
router.get('/stats', getStats);

// GET /api/analysis-text-seo/jobs/config - Obtenir la configuration des jobs
router.get('/jobs/config', getJobsConfig);

// ===== COMPATIBILITÉ TEMPORAIRE =====
// À supprimer une fois le frontend migré
router.get('/:id/status', getAnalysisStatus);

module.exports = router;