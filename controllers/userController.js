const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const Shop = require('./../models/shopModel');
const { format } = require('util');
const catchAsync = require('../utils/catchAsync');
const ErrorMsgs = require('./../utils/ErrorMsgsConstants');
const { bucket } = require('../utils/firebaseConfiguration');
const admin = require('firebase-admin');
const {
  sendNotification,
  sendMultipleNotification,
} = require('../utils/sendNotification');
var mongoose = require('mongoose');

//@desc Get All Users
//@route Get /api/v1/users
//access PUBLIC

exports.getAllUsers = catchAsync(async (req, res, next) => {
  //We pass object with key(Field we wanna return or not) : Value -> 0 dont return it with the result , 1 return it
  let users = await User.find({}, { password: 0 });
  res.status(200).json({
    status: 'success',
    users,
  });
});

//@desc Get Users By ID
//@route Get /api/v1/users/user
//access PUBLIC
exports.getUserById = catchAsync(async (req, res, next) => {
  let { userId } = req.query;
  if (!userId) {
    return next(new AppError(ErrorMsgs.NO_USER_ID, 400));
  }
  let user = await User.findById(userId);
  res.status(200).json({
    status: 'success',
    user,
  });
});

//@desc Get Users By special Type(User, Delivery, Vendor)
//@route Get /api/v1/users/type
//access PUBLIC
exports.getUserByType = catchAsync(async (req, res, next) => {
  let { userType } = req.query;
  let userTypeArray = ['user', 'vendor', 'delivery'];

  if (!userType) {
    return next(new AppError(ErrorMsgs.NO_USERTYPE, 400));
  }
  !userTypeArray.includes(userType)
    ? next(new AppError(ErrorMsgs.NO_USERTYPE, 400))
    : (userType = userType);

  let users = await User.find({ userType });

  res.status(200).json({
    status: 'success',
    users,
  });
});

//@desc Update User By ID
//@route PATCH /api/v1/users/user
//access PUBLIC
exports.updateUserById = catchAsync(async (req, res, next) => {
  let { userId } = req.query;
  if (req.file) {
    const blob = bucket.file(`users/${req.file.originalname}`);
    const blobStream = blob.createWriteStream();
    blobStream.on('finish', async () => {
      // The public URL can be used to directly access the file via HTTP.
      publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
    });

    let photoUrl = `https://storage.googleapis.com/${bucket.name}/users/${req.file.originalname}`;
    let wholeBody = { ...req.body, photo: photoUrl };

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      wholeBody,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      updatedUser,
    });
    blobStream.end(req.file.buffer);
  } else {
    let reqBodyLength = Object.keys(req.body).length;

    if (reqBodyLength === 0) {
      return next(new AppError(ErrorMsgs.NO_BODY, 400));
    }
    if (!userId) {
      return next(new AppError(ErrorMsgs.NO_USER_ID, 400));
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.query.userId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      updatedUser,
    });
  }
});

//@desc Get Users By service
//@route Get /api/v1/users/service
//access PUBLIC
exports.getUsersByService = catchAsync(async (req, res, next) => {
  let { serviceId } = req.query;
  let users = await User.find({
    service: mongoose.Types.ObjectId(serviceId),
  });
  res.status(200).json({
    status: 'success',
    users,
  });
});

//@desc Update notificationToken ==> update token to a value provided in query or clear it if there is no value passed
//@route PATCH /api/v1/users/notificationToken
//access PUBLIC
exports.updateNotificationToken = catchAsync(async (req, res, next) => {
  const notificationToken = req.query.notificationToken;
  let foundUser;
  if (notificationToken) {
    foundUser = await User.findByIdAndUpdate(
      req.user.id,
      { notificationToken },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    foundUser = await User.findByIdAndUpdate(
      req.user.id,
      { notificationToken: null },
      {
        new: true,
        runValidators: true,
      }
    );
  }
  res.status(200).json({
    status: 'success',
    foundUser,
  });
});

//@desc Notify the shops provided in the order and all the delivery boys
//@route PATCH /api/v1/users/notifyDeliveryAndShops
//access PUBLIC
exports.notifyDeliveryAndShops = catchAsync(async (req, res, next) => {
  //Get the notification token from the id of the shop wants to be notified and assign it to the registeration token

  //We are hanlding if we want to nofiy only one shop or Multiple shops
  if (req.body.shopIds.length > 1) {
    //Here we returning actual shops docs
    let shopsToBeNotified = await Shop.find().where('_id').in(req.body.shopIds);

    //We are mapping to get the shop owners ids
    let shopOwnersIds = shopsToBeNotified.map((shop) => shop.owner);

    //Finding the actual owner docs(In user collection)
    let shopOwnersDocs = await User.find().where('_id').in(shopOwnersIds);

    const shopOwnerRegistrationTokens = shopOwnersDocs
      .map((owner) => owner.notificationToken)
      .filter((token) => token);

    const message = {
      data: {
        userType: 'vendor',
        type: 'order',
      },
      topic: 'shops',
    };
    sendMultipleNotification(
      shopOwnerRegistrationTokens,
      message,
      'shops',
      res
    );
  } else {
    let shopId = req.body.shopIds[0];

    let shopToBeNotified = await Shop.findOne({ _id: shopId });

    let shopOwnerId = shopToBeNotified.owner;

    let shopOwnerDoc = await User.findOne({ _id: shopOwnerId });

    let shopOwnerRegistrationToken = shopOwnerDoc.notificationToken;

    console.log(shopOwnerRegistrationToken);
    var payload = {
      data: {
        type: 'order',
        userType: 'vendor',
        shopId: String(shopToBeNotified._id),
      },
    };
    sendNotification(shopOwnerRegistrationToken, payload, res);
  }

  //Filter in find for all the delivery boys to notify them.
  const users = await User.find({ userType: 'delivery' });
  const userRegistrationTokens = users
    .map((user) => user.notificationToken)
    .filter((token) => token);
  // Will be sent to all the delivery in the system
  const message = {
    data: {
      userType: 'delivery',
      type: 'order',
    },
    topic: 'users',
  };
  sendMultipleNotification(userRegistrationTokens, message, 'users', res);
  res.json({
    success: 'success',
  });
});
