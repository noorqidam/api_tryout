const firebase  = require("firebase");
const configAuth = {
  apiKey: "AIzaSyDxjrwMKZ-aAYljYPU1FvsdM-QNs7TXa-k",
  authDomain: "edutore01.firebaseapp.com",
  databaseURL: "https://edutore01.firebaseio.com",
  projectId: "edutore01",
  storageBucket: "",
  messagingSenderId: "926865736810"
};

firebase.initializeApp(configAuth);

module.exports = firebase;
