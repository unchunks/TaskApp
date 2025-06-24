const admin = require('firebase-admin');

const serviceAccount = require('./path/to/your/serviceAccountKey.json'); // Replace with your service account key file path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "YOUR_DATABASE_URL" // Replace with your database URL
});

module.exports = admin;