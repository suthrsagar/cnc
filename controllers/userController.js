const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedDesigns');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfileImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.file) {
      user.avatarUrl = req.file.path;
      await user.save();
      res.json(user);
    } else {
      res.status(400).json({ message: 'Please upload an image' });
    }
  } catch (error) {
    next(error);
  }
};

exports.toggleSaveDesign = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const designId = req.params.id;

    if (user.savedDesigns.includes(designId)) {
      user.savedDesigns.pull(designId);
    } else {
      user.savedDesigns.push(designId);
    }

    await user.save();
    await user.populate('savedDesigns');
    res.json(user.savedDesigns);
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Toggle role to 'blocked' or back to 'user'
    user.role = user.role === 'blocked' ? 'user' : 'blocked';
    await user.save();
    
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
