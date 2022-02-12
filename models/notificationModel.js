const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
});

const Notification = new mongoose.model('Notification', notificationSchema);
module.exports = Notification;
