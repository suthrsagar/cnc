const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const designRoutes = require('./routes/designRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/designs', designRoutes);
app.use('/api/orders', orderRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('CNC Wood Design API is running... 🚀');
});

const PORT = process.env.PORT || 5000;
let MONGO_URL = process.env.MONGO_URL;

const { cloudinary } = require('./config/cloudinary');

console.log("Checking Environment Variables:");
console.log("- MONGO_URL exists?", !!MONGO_URL);
console.log("- CLOUDINARY_CLOUD_NAME exists?", !!process.env.CLOUDINARY_CLOUD_NAME);

if (!MONGO_URL) {
  console.log("⚠️ WARNING: MONGO_URL is not set. Database will NOT be connected.");
} else {
  // Remove double quotes if they were accidentally added in Render
  MONGO_URL = MONGO_URL.replace(/^"|"/g, '').trim();

  mongoose.connect(MONGO_URL)
    .then(() => {
      console.log('Connected to MongoDB ✅');
      
      // Cloudinary Ping test
      cloudinary.api.ping()
        .then(res => console.log('Connected to Cloudinary ✅'))
        .catch(err => console.error('Cloudinary connection error ❌:', err.message));
    })
    .catch((error) => {
      console.error('MongoDB connection error ❌:', error.message);
    });
}

// Always listen on port so Render doesn't kill the app
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
