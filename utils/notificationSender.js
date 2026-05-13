const admin = require('./firebaseAdmin');
const User = require('../models/User');

/**
 * Send an advanced push notification with Smart Timing Logic
 */
exports.sendAdvancedNotification = async ({
  tokens,
  title,
  body,
  image = '',
  type = 'explore',
  id = '',
  screen = '',
  action1 = '',
  action2 = ''
}) => {
  try {
    if (!admin.apps || admin.apps.length === 0) {
      console.warn('Firebase Admin SDK not initialized.');
      return false;
    }

    if (!tokens || (Array.isArray(tokens) && tokens.length === 0)) {
      console.warn('No tokens provided for notification.');
      return false;
    }

    // --- SMART TIMING LOGIC ---
    // Prevent promotional/explore spam during late night (10 PM to 8 AM IST)
    const isPromotional = ['explore', 'offer'].includes(type);
    if (isPromotional) {
      // Get current hour in IST
      const currentHourIST = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: 'numeric', hour12: false });
      const hour = parseInt(currentHourIST, 10);
      
      if (hour >= 22 || hour < 8) {
        console.log(`[Smart Logic Blocked] Promotional notification '${title}' stopped at ${hour}:00 IST to prevent annoying users.`);
        return false;
      }
    }

    const targetTokens = Array.isArray(tokens) ? tokens : [tokens];

    const message = {
      tokens: targetTokens,
      notification: {
        title: title,
        body: body,
        ...(image && { imageUrl: image }) // Android basic image support
      },
      data: {
        title: title,
        body: body,
        type: type,
        id: id.toString(),
        screen: screen,
        image: image,
        action1: action1,
        action2: action2
      },
      android: {
        priority: 'high',
        notification: {
          channelId: ['order', 'chat'].includes(type) ? 'orders' : 'explore', // Map type to channel ID
          sound: 'default',
          priority: 'max',
          defaultSound: true,
          defaultVibrateTimings: true,
        }
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
            sound: 'default',
          }
        }
      }
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log(`Notification sent. Success: ${response.successCount}, Failed: ${response.failureCount}`);
    return response;
  } catch (error) {
    console.error('Error sending advanced notification:', error);
    return false;
  }
};
