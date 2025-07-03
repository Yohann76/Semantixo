const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MongoDB local or Atlas
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/semantixo';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 