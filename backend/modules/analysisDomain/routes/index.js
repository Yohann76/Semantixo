const express = require('express');
const router = express.Router();
const {
  createAnalysisDomain,
  getAnalysisDomain,
  getAnalysisDomainById,
  deleteAnalysisDomain,
  getAnalysisDomainStats
} = require('../controllers');
const { protect } = require('../../../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes pour les analyses de domaine
router.route('/')
  .post(createAnalysisDomain)
  .get(getAnalysisDomain);

router.route('/stats')
  .get(getAnalysisDomainStats);

router.route('/:id')
  .get(getAnalysisDomainById)
  .delete(deleteAnalysisDomain);

module.exports = router; 