const AppError = require('../utils/appError');
const Shop = require('../models/shopModel');
const { format } = require('util');
const catchAsync = require('../utils/catchAsync');
const ErrorMsgs = require('./../utils/ErrorMsgsConstants');

//@desc Create a shop(Represents any resturant etc...)
//@route POST /api/v1/shops/:categoryId
//access PRIVATE -> You have to be logged in.

exports.createShop = catchAsync(async (req, res, next) => {
  //Take id from the currently logged in user.

  req.body.owner = req.user.id;
  //Getting the categoryId from the params in the route and setting it to be in the body of the request.
  req.body.category = req.params.categoryId;

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
//@desc get a specific shop
//@route GET /api/v1/shops/:shopId
//access PUBLIC
exports.getShopById = catchAsync(async (req, res, next) => {
  if (req.params.shopId.length !== 24) {
    return next(new AppError(ErrorMsgs.INVALID_SHOPID, 400));
  }
  let shop = await Shop.findById(req.params.shopId)
    .populate('owner')
    .populate('category')
    .populate('subCategories')
    .exec();
  res.status(200).json({
    status: 'success',
    shop,
  });
});
//@desc get a shops by specific categoryID
//@route GET /api/v1/shops/shopsForCategory
//access PUBLIC
exports.getShopsByCategory = catchAsync(async (req, res, next) => {
  let shops = await Shop.find({ category: req.query.categoryId })
    .populate('owner')
    .populate('category')
    .populate('subCategories')
    .exec();
  res.status(200).json({
    status: 'success',
    shops,
  });
});
//@desc get subCategories for shop by passing shop id
//@route GET /api/v1/shops/subCategories
//access PUBLIC
exports.getSubCategoriesForShop = catchAsync(async (req, res, next) => {
  let shop = await Shop.findById(req.query.shopId).populate('subCategories');
  let subCategories = shop.subCategories;

  res.status(200).json({
    status: 'success',
    subCategories,
  });
});
