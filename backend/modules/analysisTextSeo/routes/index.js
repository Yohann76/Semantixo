const express = require('express');
const router = express.Router();
const { protect } = require('../../../middleware/auth');
const {
  createAnalysis,
  getAnalyses,
  getAnalysis,
  deleteAnalysis,
  getStats,
  getBaremeConfig
} = require('../controllers');

// Routes protégées par authentification
router.use(protect);

// POST /api/analysis-text-seo - Créer une nouvelle analyse
router.post('/', createAnalysis);

// GET /api/analysis-text-seo - Récupérer toutes les analyses de l'utilisateur
router.get('/', getAnalyses);

// GET /api/analysis-text-seo/:id - Récupérer une analyse spécifique
router.get('/:id', getAnalysis);

// DELETE /api/analysis-text-seo/:id - Supprimer une analyse
router.delete('/:id', deleteAnalysis);

// GET /api/analysis-text-seo/stats - Obtenir les statistiques
router.get('/stats', getStats);

// GET /api/analysis-text-seo/bareme/config - Obtenir la configuration du barème
router.get('/bareme/config', getBaremeConfig);

module.exports = router; 