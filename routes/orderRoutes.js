const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { name, phone, address, designId } = req.body;
    
    if (!name || !phone || !address || !designId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newOrder = new Order({
      name,
      phone,
      address,
      designId,
      status: 'Pending'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const { phone } = req.query; // to filter by user's phone if needed
    let query = {};
    if (phone) {
      query.phone = phone;
    }
    const orders = await Order.find(query)
                              .populate('designId')
                              .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/orders/:id
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (status) {
      order.status = status;
    }
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
