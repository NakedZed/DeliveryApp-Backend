const mongoose = require('mongoose');
// let uniqueValidator = require('mongoose-unique-validator');
const shopSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phone: {
    type: String,
    unique: true,
  },
  address: {
    longitude: {
      type: String,
    },
    lattitude: {
      type: String,
    },
  },
  fullAddress: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// shopSchema.plugin(uniqueValidator);
const Shop = new mongoose.model('Shop', shopSchema);
module.exports = Shop;
