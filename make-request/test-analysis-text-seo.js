// Script pour tester l'API Analysis Text SEO
// Usage: node make-request/test-analysis-text-seo.js

// Charger la configuration depuis .env
const config = require('./config');
const jwt = require('jsonwebtoken');

// Créer un token JWT valide pour les tests
function createTestToken() {
  const payload = {
    id: 'test-user-id',
    email: 'test@semantixo.com',
    role: 'admin'
  };
  
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });
}

async function testAnalysisTextSeo() {
  console.log('🚀 Test de l\'API Analysis Text SEO');
  console.log('==================================\n');

  // Utiliser le token valide depuis la config
  const testToken = config.TOKEN;
  
  console.log('🔧 Configuration:');
  console.log('- Base URL:', config.BASE_URL);
  console.log('- JWT Secret configuré:', config.isTokenConfigured() ? '✅' : '❌');
  console.log('- Token généré:', testToken ? '✅' : '❌');
  console.log('');

  try {
    const response = await fetch(config.BASE_URL + '/analysis-text-seo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: "Votre contenu SEO à analyser ici... Ce texte doit être suffisamment long pour obtenir une analyse pertinente. L'optimisation SEO nécessite un contenu de qualité avec une bonne structure, des mots-clés pertinents et une densité appropriée. Le référencement naturel est essentiel pour améliorer la visibilité de votre site web dans les moteurs de recherche.",
        keywords: ["SEO", "marketing digital", "référencement"]
      })
    });

    console.log('📊 Status de la réponse:', response.status);
    console.log('📊 Status text:', response.statusText);

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Succès! Réponse de l\'API:\n');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.data) {
        console.log('\n📈 Résumé de l\'analyse:');
        console.log(`- Score SEO: ${data.data.seoScore}/100`);
        console.log(`- Grade: ${data.data.grade}`);
        console.log(`- Thématique: ${data.data.topic}`);
        console.log(`- Mots-clés: ${data.data.keywords?.join(', ')}`);
        console.log(`- Nombre de mots: ${data.data.metrics?.wordCount}`);
      }
    } else {
      console.log('❌ Erreur! Réponse de l\'API:\n');
      console.log(JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('❌ Erreur lors de la requête:', error.message);
    
    if (error.message.includes('fetch is not defined')) {
      console.log('\n💡 Solution: Installer node-fetch ou utiliser Node.js 18+');
      console.log('npm install node-fetch');
    }
  }
}

// Vérifier si la configuration est correcte
if (!config.isTokenConfigured()) {
  console.log('⚠️  ATTENTION: Configure ton fichier .env!');
  console.log('');
  console.log('📝 Étapes:');
  console.log('1. Copie env.example vers .env');
  console.log('2. Configure JWT_SECRET dans .env');
  console.log('3. Assure-toi que le serveur backend fonctionne');
  console.log('');
  console.log('🔧 Configuration actuelle:');
  console.log(config.getConfig());
} else {
  // Vérifier si fetch et jwt sont disponibles
  if (typeof fetch === 'undefined') {
    console.log('❌ fetch n\'est pas disponible.');
    console.log('💡 Utilise Node.js 18+ ou installe node-fetch');
  } else {
    testAnalysisTextSeo();
  }
}
