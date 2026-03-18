const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trash2treasure';

const connectDB = async () => {
  try {
    // Opciones eliminadas: usenewparser, useunifiedtopology ya no son necesarios en mongoose 6+
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = { mongoose, connectDB };
