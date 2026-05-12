const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referenceDesign: { type: mongoose.Schema.Types.ObjectId, ref: 'Design' }, // Optional linked design
  customImageUrl: { type: String }, // Used if uploaded custom
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  material: { type: String, required: true },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  priceQuote: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
