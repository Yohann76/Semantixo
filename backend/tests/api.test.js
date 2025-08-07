const request = require('supertest');
const express = require('express');

// Créer une application Express simple pour les tests
const app = express();
app.use(express.json());

// Route de test simple
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API Test fonctionnelle',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/test', (req, res) => {
  const { data } = req.body;
  res.json({
    message: 'Données reçues',
    data: data
  });
});

describe('API Routes', () => {
  describe('GET /api/test', () => {
    it('should return 200 and test message', async () => {
      const response = await request(app)
        .get('/api/test')
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'API Test fonctionnelle');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/test', () => {
    it('should return 200 and echo data', async () => {
      const testData = { test: 'value' };
      
      const response = await request(app)
        .post('/api/test')
        .send({ data: testData })
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Données reçues');
      expect(response.body).toHaveProperty('data', testData);
    });
  });
}); 