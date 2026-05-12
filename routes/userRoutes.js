const express = require('express');
const router = express.Router();
const { getProfile, toggleSaveDesign, getAllUsers, blockUser, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/all').get(protect, admin, getAllUsers);
router.route('/:id/block').put(protect, admin, blockUser);
router.route('/:id').delete(protect, admin, deleteUser);

router.get('/profile', protect, getProfile);
router.put('/save-design/:id', protect, toggleSaveDesign);

module.exports = router;
