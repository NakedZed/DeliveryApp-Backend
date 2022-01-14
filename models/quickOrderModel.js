const mongoose = require('mongoose');

const quickOrderSchema = new mongoose.Schema({
  address: {
    type: String,
  },
  inCity: {
    type: Boolean,
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  userPhone: {
    type: String,
  },
  description: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
});

const QuickOrder = new mongoose.model('QuickOrder', quickOrderSchema);
module.exports = QuickOrder;
