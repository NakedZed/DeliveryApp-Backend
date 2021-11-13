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
  //Refers to main category
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  //Refers to the sub-categories that will be contained in the shop itself.
  subCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
});

// shopSchema.plugin(uniqueValidator);
const Shop = new mongoose.model('Shop', shopSchema);
module.exports = Shop;
