const Order = require('../models/Order');

exports.createOrder = async (req, res, next) => {
  try {
    const { width, height, material, notes, referenceDesign } = req.body;
    let customImageUrl = '';

    if (req.file) {
      customImageUrl = req.file.path;
    }

    if (!customImageUrl && !referenceDesign) {
      return res.status(400).json({ message: 'Provide a reference design ID or upload a custom image' });
    }

    const order = await Order.create({
      user: req.user._id,
      width,
      height,
      material,
      notes,
      referenceDesign: referenceDesign || undefined,
      customImageUrl
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
                              .populate('referenceDesign')
                              .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('referenceDesign');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('referenceDesign')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, priceQuote, adminNotes } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) order.status = status;
    if (priceQuote !== undefined) order.priceQuote = priceQuote;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;

    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    next(error);
  }
};
