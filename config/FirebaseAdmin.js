const FirebaseAdmin = require('firebase-admin');

let serviceAccount = require(__dirname + '/../config/serviceAccountKey.json');
FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://edutore01.firebaseio.com",
});

// let db = FirebaseAdmin.firestore();
module.exports = FirebaseAdmin;