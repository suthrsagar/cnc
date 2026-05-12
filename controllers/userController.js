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
