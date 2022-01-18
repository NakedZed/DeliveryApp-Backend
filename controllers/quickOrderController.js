const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const QuickOrder = require('./../models/quickOrderModel');
const catchAsync = require('../utils/catchAsync');
const { sendMultipleNotification } = require('../utils/sendNotification');

//@desc Add quick order and notify all delivery boys
//@route POST /api/v1/quickOrders/
//access PUBLIC
//NOTE we pass here the user who made the quick order in the body of the req.
exports.addQuickOrder = catchAsync(async (req, res, next) => {
  let quickOrder = await QuickOrder.create(req.body);
  const users = await User.find({ userType: 'delivery' });
  const userRegistrationTokens = users
    .map((user) => user.notificationToken)
    .filter((token) => token);
  // Will be sent to all the delivery in the system
  const message = {
    data: {
      userType: req.query.userType,
      type: 'quickOrder',
    },
    topic: 'users',
  };
  if (userRegistrationTokens.length > 0) {
    sendMultipleNotification(userRegistrationTokens, message, 'users', res);
  }
  res.status(200).json({
    status: 'success',
    quickOrder,
  });
});
//@desc Delete quick order by passing quick order ID
//@route DELETE /api/v1/quickOrders/
//access PUBLIC
exports.deleteQuickOrder = catchAsync(async (req, res, next) => {
  let { quickOrderId } = req.query;
  let deletedQuickOrder = await QuickOrder.findOneAndDelete({
    _id: quickOrderId,
  });
  res.status(200).json({
    status: 'success',
    deletedQuickOrder,
  });
});
//@desc Get quick order by passing quick order ID
//@route GET /api/v1/quickOrders/
//access PUBLIC
exports.getQuickOrderById = catchAsync(async (req, res, next) => {
  let { quickOrderId } = req.query;
  let foundQuickOrder = await QuickOrder.findOne({
    _id: quickOrderId,
  })
    .populate('user')
    .populate('delivery');
  res.status(200).json({
    status: 'success',
    foundQuickOrder,
  });
});
//@desc Update quick order by passing quick order ID and deliveryId
//@route GET /api/v1/quickOrders/
//access PUBLIC
exports.updateQuickOrder = catchAsync(async (req, res, next) => {
  let { deliveryId, quickOrderId } = req.query;
  let quickOrder = await QuickOrder.findOne({ _id: quickOrderId });
  if (quickOrder.delivery === null) {
    let updatedQuickOrder = await QuickOrder.findOneAndUpdate(
      { _id: quickOrderId },
      { delivery: deliveryId },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      updatedQuickOrder,
    });
  } else {
    return next(new AppError('لقد حدث خطأ ما', 400));
  }
});
//@desc Get quick orders by passing deliveryId
//@route GET /api/v1/quickOrders/quickOrdersForDelivery
//access PUBLIC
//Note if we didnt pass deliveryId we will get all quickorders that are not assigned for delivery
exports.getQuickOrdersForDelivery = catchAsync(async (req, res, next) => {
  if (req.query.deliveryId) {
    let quickOrders = await QuickOrder.find({
      delivery: req.query.deliveryId,
    })
      .populate('delivery')
      .populate('user');
    res.status(200).json({
      status: 'success',
      quickOrders,
    });
  } else {
    let quickOrders = await QuickOrder.find({
      delivery: null,
    });
    res.status(200).json({
      status: 'success',
      quickOrders,
    });
  }
});
//@desc Get all quick orders
//@route GET /api/v1/quickOrders/
//access PUBLIC
exports.getAllQuickOrders = catchAsync(async (req, res, next) => {
  let quickOrders = await QuickOrder.find()
    .populate('user')
    .populate('delivery');

  res.status(200).json({
    status: 'success',
    quickOrders,
  });
});
