const express = require('express');
const router = express.Router();

// Route publique pour la configuration de blacklist
router.get('/blacklist', (req, res) => {
  try {
    const { BLACKLISTED_KEYWORDS } = require('../config/blacklist_domain');
    res.json({
      success: true,
      blacklistedKeywords: BLACKLISTED_KEYWORDS
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la blacklist:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la configuration'
    });
  }
});

module.exports = router; 