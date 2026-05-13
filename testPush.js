const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

console.log("---------------------------------------------------");
console.log("🚀 STARTING PUSH NOTIFICATION TEST...");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ ERROR: serviceAccountKey.json file is MISSING!");
  console.error("I cannot send a notification without your Firebase Private Key.");
  console.error("Please download it from Firebase Console -> Project Settings -> Service Accounts, and put it in the backend folder.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Since I don't have the specific device token of your phone,
// I will try to send a message to a topic called 'all'
// Devices need to be subscribed to 'all' to receive this, 
// OR we can just send it, and if Firebase accepts it, it means the setup works.

const payload = {
  notification: {
    title: "WoodCraft CNC Test",
    body: "This is a test notification from the server!"
  },
  topic: 'all'
};

admin.messaging().send(payload)
  .then((response) => {
    console.log("✅ SUCCESS: Successfully sent test message:", response);
    console.log("---------------------------------------------------");
  })
  .catch((error) => {
    console.log("❌ ERROR: Error sending message:", error);
    console.log("---------------------------------------------------");
  });
