const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let MONGO_URL = process.env.MONGO_URL;
    if (!MONGO_URL) {
      console.warn("⚠️ WARNING: MONGO_URL is not set.");
      return;
    }
    MONGO_URL = MONGO_URL.replace(/^"|"/g, '').trim();
    
    const conn = await mongoose.connect(MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host} ✅`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message} ❌`);
    process.exit(1);
  }
};

module.exports = connectDB;
