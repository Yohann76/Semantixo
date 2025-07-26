const express = require('express');
const router = express.Router();
const {
  createAnalysisInternalLink,
  getAnalysisInternalLink,
  getAnalysisInternalLinkById,
  deleteAnalysisInternalLink,
  getAnalysisInternalLinkStats
} = require('../controllers');
const { protect } = require('../../../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes pour les analyses de liens internes
router.route('/')
  .post(createAnalysisInternalLink)
  .get(getAnalysisInternalLink);

router.route('/stats')
  .get(getAnalysisInternalLinkStats);

router.route('/:id')
  .get(getAnalysisInternalLinkById)
  .delete(deleteAnalysisInternalLink);

module.exports = router; 