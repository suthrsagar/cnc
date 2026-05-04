const express = require('express');
const router = express.Router();
const Design = require('../models/Design');
const { upload, cloudinary } = require('../config/cloudinary');

// GET /api/designs
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    const designs = await Design.find(query).sort({ createdAt: -1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/designs
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, category, price } = req.body;
    let imageUrl = req.body.imageUrl; // In case they pass URL directly

    if (req.file) {
      imageUrl = req.file.path;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const newDesign = new Design({
      title,
      imageUrl,
      category,
      price
    });

    const savedDesign = await newDesign.save();
    res.status(201).json(savedDesign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/designs/:id
router.delete('/:id', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Optional: Delete from cloudinary if we stored the public_id
    // Wait, the schema only has imageUrl, so we skip cloudinary delete for simplicity here.

    await design.deleteOne();
    res.json({ message: 'Design deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
