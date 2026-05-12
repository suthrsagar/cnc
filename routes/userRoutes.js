const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, toggleSaveDesign } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/save-design/:id')
  .put(protect, toggleSaveDesign);

module.exports = router;
