const express = require('express');
const router = express.Router();
const { getProfile, toggleSaveDesign, getAllUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/all').get(protect, admin, getAllUsers);
router.get('/profile', protect, getProfile);
router.put('/save-design/:id', protect, toggleSaveDesign);

module.exports = router;
