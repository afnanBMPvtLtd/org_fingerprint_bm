const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URI, {
      autoIndex: true
    });
    console.log('[DB] MongoDB connected');
  } catch (error) {
    console.error('[DB] MongoDB connection failed');
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;
