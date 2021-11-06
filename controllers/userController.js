const AppError = require('../utils/appError');
const User = require('./../models/userModel');
let multer = require('multer');
const admin = require('firebase-admin');
//package for resizing and handling images
const catchAsync = require('../utils/catchAsync');
const { Storage } = require('@google-cloud/storage');

// MULTER CONFIGURATION SECTION
const multerStorage = multer.memoryStorage();
//To make sure that the uploaded file is an image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
const storage = new Storage({
  projectId: 'delivery-app-5e621',
  keyFilename: 'delivery-app-5e621-firebase-adminsdk-kjin7-465d741a9b.json',
});

const bucket = storage.bucket('gs://delivery-app-5e621.appspot.com');

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

//We are creating and exporting a middleware to upload a single photo for a user
exports.uploadPhoto = upload.single('photo');

exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  console.log('reqfile>>>>>>>>>>>', req.file);
  const extension = req.file.mimetype.split('/')[1];
  req.file.filename = `user-${Date.now()}.${extension}`; //Added it to the req to be able to use it in the next middlewares Ex:(signup handle)
  next();
});
