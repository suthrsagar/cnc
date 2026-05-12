const express = require('express');
const router = express.Router();
const { getProfile, toggleSaveDesign } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/save-design/:id', protect, toggleSaveDesign);

module.exports = router;
