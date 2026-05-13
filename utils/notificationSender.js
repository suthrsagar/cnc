const admin = require('./firebaseAdmin');
const User = require('../models/User');

/**
 * Send an advanced push notification
 * @param {Object} params
 * @param {string|string[]} params.tokens - Single token or array of FCM tokens
 * @param {string} params.title - Notification title
 * @param {string} params.body - Notification body
 * @param {string} [params.image] - URL of the image for BigPicture style
 * @param {string} params.type - 'order', 'explore', 'chat', 'like', 'follow', 'offer'
 * @param {string} params.id - Reference ID (orderId, designId, chatId, etc.)
 * @param {string} [params.screen] - Screen to redirect to
 * @param {string} [params.action1] - Title for action button 1
 * @param {string} [params.action2] - Title for action button 2
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
