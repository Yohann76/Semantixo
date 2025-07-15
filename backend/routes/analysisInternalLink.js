const express = require('express');
const router = express.Router();
const {
  createAnalysisInternalLink,
  getAnalysisInternalLink,
  getAnalysisInternalLinkById,
  deleteAnalysisInternalLink,
  getAnalysisInternalLinkStats
} = require('../controllers/analysisInternalLinkController');
const { protect } = require('../middleware/auth');

// Routes protégées (nécessitent une authentification)
router.use(protect);

// POST /api/analysis-internal-link - Créer une nouvelle analyse
router.post('/', createAnalysisInternalLink);

// GET /api/analysis-internal-link - Récupérer toutes les analyses
router.get('/', getAnalysisInternalLink);

// GET /api/analysis-internal-link/stats - Récupérer les statistiques
router.get('/stats', getAnalysisInternalLinkStats);

// GET /api/analysis-internal-link/:id - Récupérer une analyse spécifique
router.get('/:id', getAnalysisInternalLinkById);

// DELETE /api/analysis-internal-link/:id - Supprimer une analyse
router.delete('/:id', deleteAnalysisInternalLink);

module.exports = router; 