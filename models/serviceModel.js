const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

const Service = new mongoose.model('Service', serviceSchema);
module.exports = Service;
