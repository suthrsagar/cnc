const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

router.route('/')
  .post(protect, upload.single('customImage'), createOrder);

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);

module.exports = router;
