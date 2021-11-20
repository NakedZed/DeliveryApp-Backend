const AppError = require('../utils/appError');
const { format } = require('util');
const catchAsync = require('../utils/catchAsync');
const ErrorMsgs = require('./../utils/ErrorMsgsConstants');
const SubCategory = require('../models/subCategoryModel');

//@desc Create a subCategory(Represents the categories inside the shop itself(products categories)
//@route POST /api/v1/subcategories/
//access PUBLIC
exports.createSubCategory = catchAsync(async (req, res, next) => {
  let { shopId } = req.query;
  if (!shopId) {
    return next(new AppError(ErrorMsgs.INVALID_SHOPID, 400));
  }
  req.body.shop = req.query.shopId;

  let subCategory = await SubCategory.create(req.body);
  res.status(200).json({
    status: 'success',
    subCategory,
  });
});

//@desc find all subCategories in the system
//@route GET /api/v1/subcategories/
//access PUBLIC
exports.getAllSubCategories = catchAsync(async (req, res, next) => {
  let subCategories = await SubCategory.find().populate('shop');
  res.status(200).json({
    status: 'success',
    subCategories,
  });
});

//@desc find all subCategories for shop by passing shopId
//@route GET /api/v1/subcategories/shopSubCategories
//access PUBLIC
exports.getSubCategoriesForShop = catchAsync(async (req, res, next) => {
  let { shopId } = req.query;
  if (!shopId) {
    return next(new AppError(ErrorMsgs.INVALID_SHOPID, 400));
  }
  let subCategories = await SubCategory.find({ shop: req.query.shopId });
  res.status(200).json({
    status: 'success',
    subCategories,
  });
});