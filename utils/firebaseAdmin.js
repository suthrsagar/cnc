const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let serviceAccount;

// Pehle check karte hain ki Environment Variables (Render) me credentials hain kya?
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Render/Vercel par multi-line string ka issue hota hai, isliye replace('\\n', '\n') zaruri hai
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };
  console.log('Firebase Admin: Using Environment Variables (Render/Production)');
} else {
  // Agar env var nahi hain, to local serviceAccountKey.json use karega (Localhost ke liye)
  const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = require(serviceAccountPath);
    console.log('Firebase Admin: Using local serviceAccountKey.json');
  }
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin SDK successfully initialized.');
} else {
  console.error('❌ Firebase Admin SDK failed to initialize. Missing Credentials.');
}

module.exports = admin;
