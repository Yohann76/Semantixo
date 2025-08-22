const express = require('express');
const router = express.Router();
const { protect } = require('../../../middleware/auth');
const {
  createAnalysis,
  getAnalyses,
  getAnalysis,
  deleteAnalysis,
  getStats,
  getAnalysisStatus,
  getJobsConfig
} = require('../controllers');

// Routes protégées par authentification
router.use(protect);

// POST /api/analysis-text-seo - Créer une nouvelle analyse
router.post('/', createAnalysis);

// GET /api/analysis-text-seo - Récupérer toutes les analyses de l'utilisateur
router.get('/', getAnalyses);

// GET /api/analysis-text-seo/:id - Récupérer une analyse spécifique
router.get('/:id', getAnalysis);

// GET /api/analysis-text-seo/:id/status - Obtenir le statut d'une analyse en cours
router.get('/:id/status', getAnalysisStatus);

// DELETE /api/analysis-text-seo/:id - Supprimer une analyse
router.delete('/:id', deleteAnalysis);

// GET /api/analysis-text-seo/stats - Obtenir les statistiques
router.get('/stats', getStats);

// GET /api/analysis-text-seo/jobs/config - Obtenir la configuration des jobs
router.get('/jobs/config', getJobsConfig);

module.exports = router;