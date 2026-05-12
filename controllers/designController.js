const Design = require('../models/Design');

// @desc    Get all designs
// @route   GET /api/designs
// @access  Public
const getDesigns = async (req, res) => {
  try {
    const { category, isTrending, search } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (isTrending) query.isTrending = isTrending === 'true';
    if (search) query.title = { $regex: search, $options: 'i' };

    const designs = await Design.find(query).sort({ createdAt: -1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single design
// @route   GET /api/designs/:id
// @access  Public
const getDesignById = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (design) {
      res.json(design);
    } else {
      res.status(404).json({ message: 'Design not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a design
// @route   POST /api/designs
// @access  Private/Admin
const createDesign = async (req, res) => {
  try {
    const design = new Design({
      ...req.body
    });
    
    // If an image was uploaded via Cloudinary multer storage
    if (req.file) {
      design.imageUrl = req.file.path;
    }

    const createdDesign = await design.save();
    res.status(201).json(createdDesign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDesigns,
  getDesignById,
  createDesign
};
