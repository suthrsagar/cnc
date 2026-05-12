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
    enum: ['Pending', 'Accepted', 'In Review', 'Design Approved', 'Cutting', 'Polishing', 'Finishing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  priceQuote: { type: Number }, // Estimated price
  finalPrice: { type: Number },
  adminNotes: { type: String },
  estimatedCompletionDate: { type: Date }
}, { timestamps: true });

// Pre-save to auto-add history on creation
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.statusHistory = [{ 
      status: this.status || 'Pending', 
      note: 'Order created',
      timestamp: Date.now()
    }];
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
