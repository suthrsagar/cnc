const Banner = require('../models/Banner');

exports.getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort('orderIndex');
    res.json(banners);
  } catch (error) {
    next(error);
  }
};

exports.addBanner = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' });
    
    const banner = new Banner({
      imageUrl: req.file.path,
      orderIndex: req.body.orderIndex || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    await banner.save();
    res.status(201).json(banner);
  } catch (error) {
    next(error);
  }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    next(error);
  }
};
