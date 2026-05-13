const admin = require('../utils/firebaseAdmin');
const User = require('../models/User');

exports.sendNotification = async (req, res, next) => {
  try {
    const { title, body, targetUserId } = req.body;
    
    // Check if firebase admin is initialized
    if (!admin.apps || admin.apps.length === 0) {
      return res.status(500).json({ message: 'Firebase Admin SDK not initialized. Missing serviceAccountKey.json' });
    }

    let tokens = [];
    
    if (targetUserId) {
      const user = await User.findById(targetUserId);
      if (user && user.fcmToken) {
        tokens.push(user.fcmToken);
      }
    } else {
      // Send to all users
      const users = await User.find({ fcmToken: { $ne: '' } });
      tokens = users.map(u => u.fcmToken);
    }
    
    if (tokens.length === 0) {
      return res.status(400).json({ message: 'No valid FCM tokens found to send notifications. Users need to login first.' });
    }

    const payload = {
      notification: {
        title,
        body
      }
    };

    const response = await admin.messaging().sendMulticast({
      tokens,
      notification: payload.notification
    });

    res.json({ message: 'Notifications sent', successCount: response.successCount, failureCount: response.failureCount });
  } catch (error) {
    next(error);
  }
};
