const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageUrls: [{ type: String }],
  description: { type: String },
  priceEstimate: { type: Number },
  isTrending: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Design', designSchema);
