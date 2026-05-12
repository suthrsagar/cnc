const User = require('../models/User');
const Order = require('../models/Order');
const Design = require('../models/Design');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const completedOrders = await Order.countDocuments({ status: 'Completed' });
    const totalDesigns = await Design.countDocuments();

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalDesigns,
      recentOrders,
      revenueStats: '0' // Placeholder
    });
  } catch (error) {
    next(error);
  }
};
