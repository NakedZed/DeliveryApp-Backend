const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  isSubCategory: {
    type: Boolean,
  },
});

const Category = new mongoose.model('Category', categorySchema);
module.exports = Category;
