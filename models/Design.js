const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  description: {
    type: String
  },
  tags: [String],
  isTrending: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  priceEstimate: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Design', designSchema);
