const Message = require('../models/Message');
const User = require('../models/User');

// User gets their own chat history with Admin
exports.getUserChat = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 }).populate('sender', 'name role');
    
    // Mark messages as read
    await Message.updateMany({ receiver: req.user._id, isRead: false }, { isRead: true });
    
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// User sends message to Admin
exports.sendMessage = async (req, res, next) => {
  try {
    const { text, receiverId } = req.body; // receiverId is optional, usually admin
    let adminReceiver = receiverId;

    if (!adminReceiver && req.user.role !== 'admin') {
      const admin = await User.findOne({ role: 'admin' });
      if (admin) adminReceiver = admin._id;
    }

    const message = new Message({
      sender: req.user._id,
      receiver: adminReceiver,
      text: text || '',
      imageUrl: req.file ? req.file.path : null
    });

    await message.save();
    
    const populatedMsg = await Message.findById(message._id).populate('sender', 'name role');
    res.status(201).json(populatedMsg);
  } catch (error) {
    next(error);
  }
};

// Admin gets list of all users who have chatted
exports.getAdminChatsList = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' }).select('name email');
    
    const chats = await Promise.all(users.map(async (user) => {
      const lastMessage = await Message.findOne({
        $or: [{ sender: user._id }, { receiver: user._id }]
      }).sort({ createdAt: -1 });

      const unreadCount = await Message.countDocuments({ sender: user._id, isRead: false });

      if (lastMessage) {
        return { user, lastMessage, unreadCount };
      }
      return null;
    }));

    const activeChats = chats.filter(chat => chat !== null).sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);
    
    res.json(activeChats);
  } catch (error) {
    next(error);
  }
};

// Admin gets chat with specific user
exports.getAdminUserChat = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: req.user._id },
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: { $exists: false } }, // Fallback if no specific admin was targeted
        { sender: userId, receiver: null }
      ]
    }).sort({ createdAt: 1 }).populate('sender', 'name role');

    await Message.updateMany({ sender: userId, isRead: false }, { isRead: true });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};
