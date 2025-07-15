const express = require('express');
const router = express.Router();
const {
  createAnalysisDomain,
  getAnalysisDomain,
  getAnalysisDomainById,
  deleteAnalysisDomain,
  getAnalysisDomainStats
} = require('../controllers/analysisDomainController');
const { protect } = require('../middleware/auth');

// Routes protégées
router.use(protect);

// Routes pour l'analyse de nom de domaine
router.route('/')
  .post(createAnalysisDomain)
  .get(getAnalysisDomain);

router.route('/stats')
  .get(getAnalysisDomainStats);

router.route('/:id')
  .get(getAnalysisDomainById)
  .delete(deleteAnalysisDomain);

module.exports = router; 