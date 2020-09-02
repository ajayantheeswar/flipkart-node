const admin = require("firebase-admin");

const serviceAccount = require("./keys/flipkart-799f4-firebase-adminsdk-ruouo-bedf599666.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flipkart-799f4.firebaseio.com",
  storageBucket: "flipkart-799f4.appspot.com",
});

exports.bucket = admin.storage().bucket()
