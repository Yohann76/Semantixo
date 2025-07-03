// Script d'initialisation MongoDB
db = db.getSiblingDB('semantixo');

// Créer un utilisateur pour l'application
db.createUser({
  user: 'semantixo',
  pwd: 'semantixo123',
  roles: [
    {
      role: 'readWrite',
      db: 'semantixo'
    }
  ]
});

// Créer les collections avec des index
db.createCollection('users');
db.createCollection('analyses');

// Créer des index pour optimiser les performances
db.users.createIndex({ "email": 1 }, { unique: true });
db.analyses.createIndex({ "userId": 1, "createdAt": -1 });
db.analyses.createIndex({ "seoScore": -1 });

print('✅ Base de données Semantixo initialisée avec succès !'); 