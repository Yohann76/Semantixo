const express = require('express');
const router = express.Router();
const {
  createAnalysisTextSeo,
  getAnalysisTextSeo,
  getAnalysisTextSeoById,
  deleteAnalysisTextSeo,
  getAnalysisTextSeoStats
} = require('../controllers');
const { protect } = require('../../../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes pour les analyses de texte SEO
router.route('/')
  .post(createAnalysisTextSeo)
  .get(getAnalysisTextSeo);

router.route('/stats')
  .get(getAnalysisTextSeoStats);

router.route('/:id')
  .get(getAnalysisTextSeoById)
  .delete(deleteAnalysisTextSeo);

module.exports = router; 