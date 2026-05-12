const express = require('express');
const router = express.Router();
const { getDesigns, getDesignById, createDesign, updateDesign, deleteDesign } = require('../controllers/designController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

router.route('/')
  .get(getDesigns)
  .post(protect, admin, upload.single('image'), createDesign);

router.route('/:id')
  .get(getDesignById)
  .put(protect, admin, upload.single('image'), updateDesign)
  .delete(protect, admin, deleteDesign);

module.exports = router;
