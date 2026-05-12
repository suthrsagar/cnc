const express = require('express');
const router = express.Router();
const { getDesigns, getDesignById, createDesign } = require('../controllers/designController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

router.route('/')
  .get(getDesigns)
  .post(protect, admin, upload.single('image'), createDesign);

router.route('/:id').get(getDesignById);

module.exports = router;
