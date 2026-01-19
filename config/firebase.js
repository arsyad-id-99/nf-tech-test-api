const admin = require('firebase-admin');

// Ambil string JSON dari Environment Variable
const serviceAccountValue = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountValue) {
  throw new Error("Environment variable FIREBASE_SERVICE_ACCOUNT tidak ditemukan!");
}

// Parse string menjadi objek JavaScript
const serviceAccount = JSON.parse(serviceAccountValue);

// Perbaikan Khusus Vercel: Mengangani karakter newline (\n) pada private key
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

module.exports = admin;