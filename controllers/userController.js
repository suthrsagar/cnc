const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedDesigns');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        savedDesigns: user.savedDesigns
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save/Unsave a design
// @route   PUT /api/users/save-design/:id
// @access  Private
const toggleSaveDesign = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const designId = req.params.id;

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const index = user.savedDesigns.indexOf(designId);
    if (index > -1) {
      // Unsave
      user.savedDesigns.splice(index, 1);
    } else {
      // Save
      user.savedDesigns.push(designId);
    }

    await user.save();
    
    // return populated saved designs
    const updatedUser = await User.findById(req.user._id).populate('savedDesigns');
    res.json(updatedUser.savedDesigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  toggleSaveDesign
};
