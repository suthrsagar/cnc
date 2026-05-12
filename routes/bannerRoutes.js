const express = require('express');
const router = express.Router();
const { getBanners, addBanner, deleteBanner } = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

router.route('/')
  .get(getBanners)
  .post(protect, admin, upload.single('image'), addBanner);

router.route('/:id').delete(protect, admin, deleteBanner);

module.exports = router;
