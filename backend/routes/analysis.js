const express = require('express');
const router = express.Router();
const { 
  createAnalysis, 
  getAnalyses, 
  getAnalysis, 
  deleteAnalysis 
} = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');

// Toutes les routes d'analyse nécessitent une authentification
router.use(protect);

// Routes pour les analyses
router.route('/')
  .post(createAnalysis)
  .get(getAnalyses);

router.route('/:id')
  .get(getAnalysis)
  .delete(deleteAnalysis);

module.exports = router; 