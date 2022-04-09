const User = require('./../models/userModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const { format } = require('util');
const Favorite = require('../models/favoriteModel');
const ErrorMsgs = require('../utils/ErrorMsgsConstants');
const { bucket } = require('../utils/firebaseConfiguration');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const client = require('twilio')(
  'AC217f0419307f649d37a1af4d1980d36d',
  '811583255d7063465d8137306f657b82'
);

// const { Storage } = require('@google-cloud/storage');

// const storage = new Storage({
//   projectId: 'delivery-app-5e621',
//   keyFilename: 'delivery-app-5e621-firebase-adminsdk-kjin7-465d741a9b.json',
// });
// let bucket = storage.bucket('gs://delivery-app-5e621.appspot.com');

signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

createSendToken = (user, statusCode, res) => {
  //Creating a token by signing it with the payload of the newley created user and a secret
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  let { username, email, phone, userType } = req.body;

  //Checking for unqiueness of username
  if (username) {
    let username = await User.findOne({ username: req.body.username });
    if (username) {
      return next(new AppError(ErrorMsgs.DUPLICATE_USERNAME, 400));
    }
  }
  //Checking for uniquness of phone number
  if (phone) {
    let phone = await User.findOne({ phone: req.body.phone });
    if (phone) {
      return next(new AppError(ErrorMsgs.DUPLICATE_PHONE, 400));
    }
  }
  /////////////////////////////////////////////
  //Handle comparing passwords
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError(ErrorMsgs.COMPARE_PASSWORD));
  }
  if (!username) {
    return next(new AppError(ErrorMsgs.NO_USERNAME, 400));
  }
  if (!phone) {
    return next(new AppError(ErrorMsgs.NO_PHONE, 400));
  }
  if (!userType) {
    return next(new AppError(ErrorMsgs.NO_USERTYPE, 400));
  }
  if (req.query.serviceId) {
    req.body.service = req.query.serviceId;
  }
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
    let newUser = await User.create(wholeBody);
    createSendToken(newUser, 201, res);
    await Favorite.create({
      user: newUser._id,
    });
    blobStream.end(req.file.buffer);
  } else {
    let newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
    //We are intializting favorites for user by creating empty collection for favorites
    await Favorite.create({
      user: newUser._id,
    });
  }
});
exports.loginWithPhone = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { phone, password } = req.body;
  if (req.body.phone.length !== 11) {
    return next(new AppError(ErrorMsgs.INVALID_PHONE, 400));
  }

  if (!phone || !password) {
    return next(new AppError(ErrorMsgs.NO_PHONE_OR_PASSWORD));
  }
  //we need to check if email and password exists
  //check if user exists && password is correct
  const user = await User.findOne({ phone });

  //Handling incorrect password for arabic
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(ErrorMsgs.INVALID_PHONE_OR_PASSWORD));
  }
  //if everything is ok, send the token to the client
  const token = signToken(user._id);
  // updateUserNotificationToken(req);

  res.status(200).json({
    status: 'sucess',
    token,
    userType: user.userType,
    userId: user.id,
  });
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1)Get current user from the collection
  const foundUser = await User.findById(req.user.id);
  //2)Check if posted current password is correct
  if (
    !(await foundUser.correctPassword(
      req.body.passwordCurrent,
      foundUser.password
    ))
  ) {
    return next(new AppError(ErrorMsgs.COMPARE_PASSWORD, 400));
  }
  console.log(foundUser);
  //3)If so, update the password
  foundUser.password = req.body.password;
  foundUser.passwordConfirm = req.body.passwordConfirm;
  await foundUser.save();
  //4)Log user in, send JWT
  createSendToken(foundUser, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) Get the token and check if its exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token && req.query.lang === 'ar') {
    return next(new AppError('من فضلك قم بالدخول اولا لتحصل علي الصلاحيات'));
  }
  if (!token) {
    return next(
      new AppError('You are not logged in, Please log in to get access', 401)
    );
  }

  //2) We need to verify  the token && promisify turn a function to a promise we can await for it
  // The decoded result has the user that is trying to access protected route
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3)Check if user stills exists , currentUser is the user based on decoded id
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The token belongs to a user has no longer exists', 401)
    );
  }
  //4)Check if user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! please login again!', 401)
    );
  }
  //Grants access to the proteced route
  req.user = currentUser;
  next();
});
//TODO:Add ServiceID, AccountSID and authToken in heroku config vars
exports.forgetPassword = catchAsync(async (req, res, next) => {
  let { phone } = req.query;
  let users = await User.find();
  let phoneNumbersArr = users.map((user) => user.phone);
  if (phoneNumbersArr.includes(phone)) {
    let data = await client.verify
      //SerivceID
      .services('VAb89361249413bef3292cffb6fddf84ab')
      // to: `+201007959398`,
      .verifications.create({
        to: `+2${phone}`,
        channel: 'sms',
      });

    res.status(200).json({
      data,
      status: 'success',
    });
  } else {
    return next(new AppError('هذا الرقم غير موجود!'));
  }
});

exports.verifyAndReset = catchAsync(async (req, res, next) => {
  let { phone, code } = req.query;
  let response = await client.verify
    .services('VAb89361249413bef3292cffb6fddf84ab')
    .verificationChecks.create({
      to: `+2${phone}`,
      code,
    });

  if (response.status === 'approved') {
    let user = await User.findOne({ phone: req.query.phone });
    console.log(user);
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    //3)Log the user in, send JWT
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
      user,
    });
  } else {
    console.log('failed');
  }
});
