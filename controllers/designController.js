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
    const design = new Design(req.body);
    if (req.file) {
      design.imageUrl = req.file.path;
    }
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

    if (req.file) {
      design.imageUrl = req.file.path;
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
