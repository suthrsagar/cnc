const Design = require('../models/Design');

exports.getDesigns = async (req, res, next) => {
  try {
    const { category, isTrending, search } = req.query;
    let query = {};

    if (category && category !== 'All') query.category = category;
    if (isTrending === 'true') query.isTrending = true;
    if (search) query.title = { $regex: search, $options: 'i' };

    const designs = await Design.find(query).sort({ createdAt: -1 });
    res.json(designs);
  } catch (error) {
    next(error);
  }
};

exports.getDesignById = async (req, res, next) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ message: 'Design not found' });
    
    design.views += 1;
    await design.save();
    
    res.json(design);
  } catch (error) {
    next(error);
  }
};

exports.createDesign = async (req, res, next) => {
  try {
    const designData = req.body;
    let images = [];
    
    if (req.files && req.files.length > 0) {
      images = req.files.map(f => f.path);
    } else if (req.file) {
      images = [req.file.path];
    }

    if (images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const design = new Design({
      ...designData,
      imageUrl: images[0],
      imageUrls: images
    });

    await design.save();
    res.status(201).json(design);
  } catch (error) {
    next(error);
  }
};

exports.updateDesign = async (req, res, next) => {
  try {
    const { title, category, isTrending, isFeatured, description } = req.body;
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ message: 'Design not found' });

    if (title) design.title = title;
    if (category) design.category = category;
    if (description) design.description = description;
    if (isTrending !== undefined) design.isTrending = isTrending;
    if (isFeatured !== undefined) design.isFeatured = isFeatured;

    let images = [...(design.imageUrls || [])];
    if (req.files && req.files.length > 0) {
      images = [...images, ...req.files.map(f => f.path)];
    } else if (req.file) {
      images.push(req.file.path);
    }

    if (images.length > 0) {
      design.imageUrl = images[0];
      design.imageUrls = images;
    }

    await design.save();
    res.json(design);
  } catch (error) {
    next(error);
  }
};

exports.deleteDesign = async (req, res, next) => {
  try {
    const design = await Design.findByIdAndDelete(req.params.id);
    if (!design) return res.status(404).json({ message: 'Design not found' });
    res.json({ message: 'Design removed' });
  } catch (error) {
    next(error);
  }
};
