const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  orderItems: [
    {
      products: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          qty: { type: Number },
          price: { type: Number },
        },
      ],
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
  // orderItems: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Cart',
  //   },
  // ],
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
