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

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const { cloudinary } = require('./config/cloudinary');

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB ✅');
    
    // Cloudinary Ping test
    cloudinary.api.ping()
      .then(res => console.log('Connected to Cloudinary ✅'))
      .catch(err => console.error('Cloudinary connection error ❌:', err.message));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error ❌:', error);
  });
