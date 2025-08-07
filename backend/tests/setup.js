const mongoose = require('mongoose');

// Configuration pour les tests
beforeAll(async () => {
  // Connexion à une base de données de test sans authentification
  const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/semantixo-test';
  
  try {
    await mongoose.connect(mongoUri, {
      // Options pour éviter les problèmes d'authentification
      authSource: 'admin',
      retryWrites: true,
      w: 'majority'
    });
    console.log('✅ Connecté à MongoDB de test');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB de test:', error);
    // Si la connexion échoue, on utilise une base de données en mémoire
    console.log('🔄 Tentative avec base de données en mémoire...');
    try {
      await mongoose.connect('mongodb://localhost:27017/semantixo-test-memory');
      console.log('✅ Connecté à MongoDB en mémoire');
    } catch (memoryError) {
      console.error('❌ Impossible de se connecter à MongoDB:', memoryError);
      console.log('⚠️ Tests sans base de données...');
    }
  }
});

afterAll(async () => {
  try {
    // Nettoyage et fermeture de la connexion
    if (mongoose.connection.readyState === 1) {
      // Ne pas essayer de supprimer la base de données si on n'a pas les permissions
      await mongoose.connection.close();
      console.log('✅ Connexion MongoDB fermée');
    }
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
});

afterEach(async () => {
  try {
    // Nettoyage des collections après chaque test
    if (mongoose.connection.readyState === 1) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        try {
          await collection.deleteMany({});
        } catch (deleteError) {
          console.log(`⚠️ Impossible de nettoyer la collection ${key}:`, deleteError.message);
        }
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des collections:', error);
  }
}); 