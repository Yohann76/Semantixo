// backend/index.js
require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import des routes
const authRoutes = require('./routes/auth');
const analysisRoutes = require('./routes/analysis');
const adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 3000;

// Connexion à la base de données
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/admin', adminRoutes);

// Routes de test (à supprimer en production)
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Semantixo - Analyse SEO',
    version: '1.0.0',
    status: 'success',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      analysis: '/api/analysis',
      admin: '/api/admin'
    }
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'API test réussie !',
    data: {
      version: '1.0.0',
      features: ['SEO Analysis', 'Text Processing', 'User Authentication', 'Database Integration'],
      serverTime: new Date().toISOString()
    },
    status: 'success'
  });
});

app.get('/api/hello/:name', (req, res) => {
  const { name } = req.params;
  res.json({
    message: `Bonjour ${name} !`,
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur interne',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

app.listen(port, () => {
  console.log(`🚀 Serveur Semantixo démarré sur http://localhost:${port}`);
  console.log(`📊 Base de données: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/semantixo'}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
});
