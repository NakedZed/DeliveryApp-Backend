const AppError = require('../utils/appError');
const Shop = require('../models/shopModel');
const { format } = require('util');
const catchAsync = require('../utils/catchAsync');
const ErrorMsgs = require('./../utils/ErrorMsgsConstants');

//@desc Create a shop(Represents any resturant etc...)
//@route POST /api/v1/shops/
//access PRIVATE -> You have to be logged in.

exports.createShop = catchAsync(async (req, res, next) => {
  //Take id from the currently logged in user.

  req.body.owner = req.user.id;

  let shop = await Shop.create(req.body);
  res.status(200).json({
    status: 'success',
    shop,
  });
});
//@desc get all shops in the system
//@route GET /api/v1/shops/
//access PUBLIC
exports.getAllShops = catchAsync(async (req, res, next) => {
  let shops = await Shop.find({});
  res.status(200).json({
    status: 'success',
    shops,
  });
});
