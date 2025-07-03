// backend/index.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware for parsing JSON
app.use(express.json());

// CORS middleware pour permettre les requêtes depuis le frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Route principale
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello SEO Tool!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Route de test pour l'API
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API test réussie !',
    data: {
      version: '1.0.0',
      features: ['SEO Analysis', 'Text Processing', 'API Testing'],
      serverTime: new Date().toISOString()
    },
    status: 'success'
  });
});

// Route pour tester les paramètres
app.get('/api/hello/:name', (req, res) => {
  const { name } = req.params;
  res.json({
    message: `Bonjour ${name} !`,
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Backend Express server running on http://localhost:${port}`);
});
