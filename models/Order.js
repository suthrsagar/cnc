const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referenceImageUrl: {
    type: String,
    required: [true, 'Please add a reference image']
  },
  width: {
    type: Number,
    required: [true, 'Please specify width']
  },
  height: {
    type: Number,
    required: [true, 'Please specify height']
  },
  material: {
    type: String,
    required: [true, 'Please specify material']
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  priceEstimate: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
