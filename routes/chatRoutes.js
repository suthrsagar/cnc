const express = require('express');
const router = express.Router();
const { getUserChat, sendMessage, getAdminChatsList, getAdminUserChat } = require('../controllers/chatController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

router.route('/my').get(protect, getUserChat);
router.route('/send').post(protect, upload.single('image'), sendMessage);

router.route('/admin/list').get(protect, admin, getAdminChatsList);
router.route('/admin/user/:userId').get(protect, admin, getAdminUserChat);

module.exports = router;
