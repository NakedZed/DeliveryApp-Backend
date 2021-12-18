const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  orderItems: [
    {
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
      },
      orderStatus: {
        type: String,
        default: 'Not delivered',
      },
    },
  ],

  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  totalPrice: {
    type: Number,
    default: 0.0,
  },
  totalDelivery: {
    type: Number,
    default: 0.0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = new mongoose.model('Order', orderSchema);
module.exports = Order;
