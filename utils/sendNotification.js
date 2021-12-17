const admin = require('firebase-admin');

var serviceAccount = require('../delivery-app-5e621-firebase-adminsdk-kjin7-465d741a9b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//This function takes notification token and payload and it sends notification to a proper device
exports.sendNotification = (notificationToken, payload) => {
  var options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };

  admin
    .messaging()
    .sendToDevice(notificationToken, payload, options)
    .then((response) => {
      console.log('Message sent successfully', response);
      console.log(response.results[0].error);
    })
    .catch((err) => console.log('Error in sending message', err));
};
