// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import des routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const modulesRoutes = require('./routes/modules');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', modulesRoutes);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API Semantixo fonctionnelle',
    version: '1.0.0',
    modules: {
      auth: '/api/auth',
      admin: '/api/admin',
      analysisTextSeo: '/api/analysis-text-seo',
      analysisPageSeo: '/api/analysis-page-seo',
      analysisInternalLink: '/api/analysis-internal-link',
      analysisDomain: '/api/analysis-domain',
    },
    features: ['SEO Analysis', 'Text Processing', 'User Authentication', 'Database Integration'],
    timestamp: new Date().toISOString()
  });
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB');
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion MongoDB:', error);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

