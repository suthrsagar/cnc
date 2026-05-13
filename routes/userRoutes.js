const express = require('express');
const router = express.Router();
const { getProfile, updateProfileImage, toggleSaveDesign, getAllUsers, blockUser, toggleAdmin, deleteUser, updateFcmToken } = require('../controllers/userController');
const { sendNotification } = require('../controllers/adminNotificationController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

router.route('/all').get(protect, admin, getAllUsers);
router.route('/:id/block').put(protect, admin, blockUser);
router.route('/:id/admin').put(protect, admin, toggleAdmin);
router.route('/:id').delete(protect, admin, deleteUser);
router.post('/admin/send-notification', protect, admin, sendNotification);

router.get('/profile', protect, getProfile);
router.put('/profile/image', protect, upload.single('avatar'), updateProfileImage);
router.put('/profile/fcm-token', protect, updateFcmToken);
router.put('/save-design/:id', protect, toggleSaveDesign);

module.exports = router;
