const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const { format } = require('util');
const catchAsync = require('../utils/catchAsync');
const ErrorMsgs = require('./../utils/ErrorMsgsConstants');
const { bucket } = require('../utils/firebaseConfiguration');

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
  let userTypeArray = ['User', 'Vendor', 'Star'];

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
