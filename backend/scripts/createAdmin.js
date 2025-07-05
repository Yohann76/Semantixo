require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

// Connexion à la base de données
const connectDB = require('../config/database');

const createAdminUser = async () => {
  try {
    // Connexion à la base de données
    await connectDB();
    console.log('✅ Connexion à la base de données établie');

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Un administrateur existe déjà dans la base de données');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Nom: ${existingAdmin.name}`);
      console.log(`🔑 Rôle: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Données de l'administrateur par défaut
    const adminData = {
      name: 'Administrateur',
      email: 'admin@semantixo.com',
      password: 'admin123456',
      role: 'admin',
      subscription: 'premium'
    };

    // Créer l'utilisateur admin
    const admin = await User.create(adminData);

    console.log('✅ Administrateur créé avec succès !');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`👤 Nom: ${admin.name}`);
    console.log(`🔑 Rôle: ${admin.role}`);
    console.log(`🔐 Mot de passe: ${adminData.password}`);
    console.log('\n⚠️  IMPORTANT: Changez le mot de passe après la première connexion !');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error.message);
    process.exit(1);
  }
};

// Exécuter le script
createAdminUser(); 