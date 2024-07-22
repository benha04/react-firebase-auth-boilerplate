const admin = require('firebase-admin');
const serviceAccount = require('../../.env'); // Replace with the path to your JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
