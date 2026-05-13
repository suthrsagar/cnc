const admin = require('../utils/firebaseAdmin');
const User = require('../models/User');
const { sendAdvancedNotification } = require('../utils/notificationSender');

exports.sendNotification = async (req, res, next) => {
  try {
    const { title, body, targetUserId, image } = req.body;
    
    // Check if firebase admin is initialized
    if (!admin.apps || admin.apps.length === 0) {
      return res.status(500).json({ message: 'Firebase Admin SDK not initialized.' });
    }

    if (targetUserId) {
      // Send to specific User
      const user = await User.findById(targetUserId);
      if (user && user.fcmToken) {
        await sendAdvancedNotification({
          tokens: [user.fcmToken],
          title: title || 'Admin Alert',
          body: body,
          image: image,
          type: 'alert',
          screen: 'Home',
        });
        return res.json({ message: 'Notification sent successfully to the user' });
      } else {
        return res.status(400).json({ message: 'User does not have an active device token.' });
      }
    } else {
      // Send to all users (topic: all_devices)
      // This reaches EVERYONE who has installed the app and granted notification permissions, 
      // regardless of login status.
      const topicMessage = {
        topic: 'all_devices',
        notification: {
          title: title || 'Global Update',
          body: body,
          ...(image && { imageUrl: image })
        },
        data: {
          title: title || 'Global Update',
          body: body,
          type: 'alert',
          screen: 'Home',
          image: image || ''
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'explore',
            sound: 'default',
            priority: 'max',
          }
        }
      };

      const response = await admin.messaging().send(topicMessage);
      return res.json({ message: 'Global broadcast notification sent successfully', messageId: response });
    }
  } catch (error) {
    console.error('Error in admin sendNotification:', error);
    next(error);
  }
};
