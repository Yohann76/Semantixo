// Script pour obtenir un token JWT via l'API auth
// Usage: node make-request/get-token.js

const BASE_URL = 'http://localhost:3000/api';

const USER_CREDENTIALS = {
  email: 'admin@semantixo.com',
  password: 'admin123456'        
};

async function getAuthToken() {
  console.log('🔑 Tentative de connexion pour obtenir le token JWT');
  console.log('================================================\n');

  try {
    console.log('📧 Email:', USER_CREDENTIALS.email);
    console.log('🔒 Mot de passe: [MASQUÉ]');
    console.log('🌐 URL:', `${BASE_URL}/auth/login\n`);

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(USER_CREDENTIALS)
    });

    console.log('📊 Status:', response.status, response.statusText);

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Connexion réussie!\n');
      
      if (data.token || data.data?.token) {
        const token = data.token || data.data.token;
        console.log('🎯 TOKEN JWT:');
        console.log('━'.repeat(50));
        console.log(token);
        console.log('━'.repeat(50));
        console.log('\n📝 Pour utiliser ce token:');
        console.log('1. Copie le token ci-dessus');
        console.log('2. Ouvre make-request/config.js');
        console.log('3. Remplace YOUR_JWT_TOKEN_HERE par ce token');
        console.log('\n🚀 Ensuite tu peux lancer:');
        console.log('node make-request/test-analysis-text-seo.js');
        console.log('node make-request/test-all-apis.js');
      } else {
        console.log('⚠️  Token non trouvé dans la réponse:');
        console.log(JSON.stringify(data, null, 2));
      }
    } else {
      console.log('❌ Échec de la connexion:');
      console.log(JSON.stringify(data, null, 2));
      
      console.log('\n💡 Solutions possibles:');
      console.log('1. Vérifier l\'email et le mot de passe dans ce fichier');
      console.log('2. Créer un compte sur le frontend d\'abord');
      console.log('3. Vérifier que le serveur backend fonctionne');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 fetch n\'est pas disponible. Solutions:');
      console.log('1. Utiliser Node.js 18+');
      console.log('2. Ou installer: npm install node-fetch');
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Le serveur backend ne répond pas. Vérifier:');
      console.log('1. Le serveur est-il démarré? (npm run dev)');
      console.log('2. Le port est-il correct? (3000)');
    }
  }
}

// Vérifier les informations de connexion
if (USER_CREDENTIALS.email === 'test@example.com') {
  console.log('⚠️  ATTENTION: Tu dois configurer tes vraies informations de connexion!');
  console.log('');
  console.log('📝 Ouvre ce fichier et modifie:');
  console.log('- USER_CREDENTIALS.email');
  console.log('- USER_CREDENTIALS.password');
  console.log('');
} else {
  // Vérifier si fetch est disponible
  if (typeof fetch === 'undefined') {
    console.log('❌ fetch n\'est pas disponible.');
    console.log('💡 Solutions:');
    console.log('1. Utiliser Node.js 18+ (recommandé)');
    console.log('2. Ou installer node-fetch: npm install node-fetch');
  } else {
    getAuthToken();
  }
}
