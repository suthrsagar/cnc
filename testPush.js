require('dotenv').config();
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

console.log("---------------------------------------------------");
console.log("🚀 STARTING PUSH NOTIFICATION TEST TO DEVICE...");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ ERROR: serviceAccountKey.json file is MISSING!");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const User = require('./models/User'); // Mongoose model

async function runTest() {
  try {
    console.log("Connecting to Database...");
    await connectDB();
    
    console.log("Searching for registered devices...");
    // Find a user who has logged in and synced their FCM token
    const usersWithTokens = await User.find({ fcmToken: { $exists: true, $ne: "" } });
    
    if (usersWithTokens.length === 0) {
      console.log("⚠️ No FCM Tokens found in the database!");
      console.log("Please OPEN THE APP on your phone first so it can register the token, then try again.");
      process.exit(0);
    }

    const targetUser = usersWithTokens[0];
    console.log(`Found device for user: ${targetUser.email}`);
    
    const payload = {
      notification: {
        title: "Test Successful! 🎉",
        body: "Your WoodCraft CNC push notifications are perfectly working on your phone!"
      },
      token: targetUser.fcmToken
    };

    console.log("Sending push notification to the phone...");
    const response = await admin.messaging().send(payload);
    console.log("✅ SUCCESS: Phone received the message! ID:", response);
    
  } catch (error) {
    console.log("❌ ERROR:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

runTest();
