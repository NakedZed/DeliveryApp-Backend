const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
  },
  price: {
    type: Number,
  },
});
const Product = new mongoose.model('Product', productSchema);
module.exports = Product;
