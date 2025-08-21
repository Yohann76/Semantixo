// Configuration globale pour les tests API
require('dotenv').config();

module.exports = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  
  // JWT Secret pour signer les tokens
  JWT_SECRET: process.env.JWT_SECRET || 'votre_secret_jwt_tres_securise_ici_changez_le_en_production',
  
  // Token utilisateur valide pour les tests / copier le token ici
  TOKEN: process.env.TEST_JWT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Njk2MTFmNzY0MjI3YmI0NzBjNjZhOCIsImlhdCI6MTc1NTc3OTMwMywiZXhwIjoxNzU2Mzg0MTAzfQ.ELA_se7qJtuVmGULLLA_ABZYy275M3SiCJ7Ql0wj9Ec',
  
  getHeaders: function() {
    return {
      'Authorization': `Bearer ${this.TOKEN}`,
      'Content-Type': 'application/json'
    };
  },
  
  isTokenConfigured: function() {
    return this.JWT_SECRET && this.JWT_SECRET.length > 10;
  },
  
  // Informations pour les tests
  getConfig: function() {
    return {
      baseUrl: this.BASE_URL,
      jwtSecret: this.JWT_SECRET,
      tokenConfigured: this.isTokenConfigured(),
      mongoUri: process.env.MONGODB_URI,
      port: process.env.PORT || 3000
    };
  }
};
