const express = require('express');
const router = express.Router();

// Importer les modules
const modules = require('../modules');

// Routes pour l'analyse de texte SEO
router.use('/analysis-text-seo', modules.analysisTextSeo.routes);

// Routes pour l'analyse de page SEO
router.use('/analysis-page-seo', modules.analysisPageSeo.routes);

// Routes pour l'analyse de liens internes
router.use('/analysis-internal-link', modules.analysisInternalLink.routes);

// Routes pour l'analyse de domaine
router.use('/analysis-domain', modules.analysisDomain.routes);

module.exports = router; 