const express = require('express');
const router = express.Router();
const {
  createAnalysisPageSeo,
  getAnalysisPageSeo,
  getAnalysisPageSeoById,
  deleteAnalysisPageSeo,
  getAnalysisPageSeoStats
} = require('../controllers');
const { protect } = require('../../../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes pour les analyses de page SEO
router.route('/')
  .post(createAnalysisPageSeo)
  .get(getAnalysisPageSeo);

router.route('/stats')
  .get(getAnalysisPageSeoStats);

router.route('/:id')
  .get(getAnalysisPageSeoById)
  .delete(deleteAnalysisPageSeo);

module.exports = router; 