require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

// Connexion à la base de données
const connectDB = require('../config/database');

const createDefaultUsers = async () => {
  try {
    // Connexion à la base de données
    await connectDB();
    console.log('✅ Connexion à la base de données établie');

    // Vérifier si des utilisateurs existent déjà
    const existingUsers = await User.find({});
    if (existingUsers.length > 0) {
      console.log('⚠️  Des utilisateurs existent déjà dans la base de données :');
      existingUsers.forEach(user => {
        console.log(`📧 Email: ${user.email}`);
        console.log(`👤 Nom: ${user.name}`);
        console.log(`🔑 Rôle: ${user.role}`);
        console.log(`💳 Abonnement: ${user.subscription}`);
        console.log('---');
      });
      process.exit(0);
    }

    // Données des utilisateurs par défaut
    const defaultUsers = [
      {
        name: 'Administrateur',
        email: 'admin@semantixo.com',
        password: 'admin123456',
        role: 'admin',
        subscription: 'premium'
      },
      {
        name: 'Administrateur1',
        email: 'admin1@semantixo.com',
        password: 'admin123456',
        role: 'admin',
        subscription: 'premium'
      },
      {
        name: 'Yohann Durand',
        email: 'yohanndurand76@gmail.com',
        password: 'devdev',
        role: 'admin',
        subscription: 'premium'
      },
      {
        name: 'Member Semantixo',
        email: 'membersemantixo@gmail.com',
        password: 'devdev',
        role: 'member',
        subscription: 'free'
      }
    ];

    console.log('🔄 Création des utilisateurs par défaut...');

    // Créer les utilisateurs
    const createdUsers = [];
    for (const userData of defaultUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      
      console.log('✅ Utilisateur créé :');
      console.log(`📧 Email: ${user.email}`);
      console.log(`👤 Nom: ${user.name}`);
      console.log(`🔑 Rôle: ${user.role}`);
      console.log(`💳 Abonnement: ${user.subscription}`);
      console.log(`🔐 Mot de passe: ${userData.password}`);
      console.log('---');
    }

    console.log(`🎉 ${createdUsers.length} utilisateurs créés avec succès !`);
    console.log('\n⚠️  IMPORTANT: Changez les mots de passe après la première connexion !');
    console.log('\n📋 Récapitulatif des comptes créés :');
    console.log('👨‍💼 Administrateurs :');
    console.log('1. admin@semantixo.com / admin123456');
    console.log('2. yohanndurand76@gmail.com / devdev');
    console.log('\n👤 Membre :');
    console.log('3. membersemantixo@gmail.com / devdev');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error.message);
    process.exit(1);
  }
};

// Exécuter le script
createDefaultUsers(); 