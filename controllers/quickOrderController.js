const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const QuickOrder = require('./../models/quickOrderModel');
const catchAsync = require('../utils/catchAsync');
const ErrorMsgs = require('./../utils/ErrorMsgsConstants');
const {
  sendNotification,
  sendMultipleNotification,
} = require('../utils/sendNotification');

exports.addQuickOrder = catchAsync(async (req, res, next) => {
  let quickOrder = await QuickOrder.create(req.body);

  const users = await User.find({ userType: 'delivery' });
  const userRegistrationTokens = users
    .map((user) => user.notificationToken)
    .filter((token) => token);
  // Will be sent to all the delivery in the system
  console.log('>>>>>>>>>>>>>>>>>', userRegistrationTokens);
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
exports.getQuickOrderById = catchAsync(async (req, res, next) => {
  let { quickOrderId } = req.query;
  let foundQuickOrder = await QuickOrder.findOne({ _id: quickOrderId });
  res.status(200).json({
    status: 'success',
    foundQuickOrder,
  });
});
exports.updateQuickOrder = catchAsync(async (req, res, next) => {
  let { userId, quickOrderId } = req.query;
  let quickOrder = await QuickOrder.findOne({ _id: quickOrderId });
  if (quickOrder.delivery === null) {
    let updatedQuickOrder = await QuickOrder.findOneAndUpdate(
      { _id: quickOrderId },
      { delivery: userId },
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
    return next(new AppError('لقد حدث خطأ ما'));
  }
});
exports.getQuickOrdersForDelivery = catchAsync(async (req, res, next) => {
  if (req.query.userId) {
    let quickOrders = await QuickOrder.find({
      delivery: req.query.userId,
    }).populate('delivery');
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
