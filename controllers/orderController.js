const catchAsync = require('../utils/catchAsync');
const Order = require('../models/orderModel');
const AppError = require('./../utils/appError');

//@desc Create Order
//@route POST /api/orders/order
//@access Private //User must be logged in
exports.createOrder = catchAsync(async (req, res, next) => {
  //Delivery in body refers to the delivery boy who will deliver the order.
  const { orderItems, delivery } = req.body;
  let wholeBody = { ...req.body, user: req.user._id, delivery: delivery };
  if (orderItems && orderItems.length === 0) {
    return next(new AppError(' عفوا لا يوجد منتجات ', 400));
  } else {
    let order = await Order.create(wholeBody);

    res.status(200).json({
      status: 'success',
      order,
    });
  }
  //TODO:Notify all shops in the order and all the delivery boys
});

//@desc Get Order
//@route Get /api/orders/userOrders
//@access Private //User must be logged in
exports.getOrdersForUser = catchAsync(async (req, res, next) => {
  let userOrders = await Order.find({ user: req.user._id });
  res.status(200).json({
    status: 'success',
    count: userOrders.length,
    userOrders,
  });
});

//@desc Get Order by id
//@route Get /api/orders/order
//@access Public
exports.getOrderById = catchAsync(async (req, res, next) => {
  let { orderId } = req.query;
  let order = await Order.findById(orderId);
  res.status(200).json({
    status: 'success',
    order,
  });
});
//@desc Get Orders for delivery boys
//@route Get /api/orders/ordersForDelivery
//@access Private
exports.getOrdersForDelivery = catchAsync(async (req, res, next) => {
  let { userId } = req.query;
  let ordersForDelivery = await Order.find({ delivery: userId });
  res.status(200).json({
    status: 'success',
    count: ordersForDelivery.length,
    ordersForDelivery,
  });
});

//@desc Delete Orders
//@route Delete /api/orders/
//@access Public
exports.deleteOrders = catchAsync(async (req, res, next) => {
  if (req.body.orders.length === 0) {
    return next(new AppError('من فضلك ادخل الاوردرات صحيحا'));
  }
  let { orders } = req.body;
  let deletedMedicine = await Order.deleteMany({
    _id: {
      $in: orders,
    },
  });
  res.status(200).json({
    status: 'success',
    count: deletedMedicine.deletedCount,
  });
});

//@desc Get all Orders
//@route Get /api/orders/
//@access Public
exports.getAllOrders = catchAsync(async (req, res, next) => {
  let orders = await Order.find();
  res.status(200).json({
    status: 'success',
    count: orders.length,
    orders,
  });
});

// exports.getAllOrdersForSpecificShop = catchAsync(async (req, res, next) => {
//   let { shopId } = req.query;
//   let orders = await Order.find({
//     shopId: {
//       $in: '61bc9789c86910a13e533c55',
//     },
//   });
//   //   let filteredOrderItems = orders.map((order) => order.orderItems);
//   res.status(200).json({
//     status: 'success',
//     count: orders.length,
//     orders,
//   });
//   console.log(orders);
// });
