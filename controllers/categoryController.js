const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const ErrorMsgs = require('./../utils/ErrorMsgsConstants');
const Category = require('../models/categoryModel');

//@desc Create a category(Represents if the Shop in the food category or anything else etc...)
//@route POST /api/v1/category/
//access PUBLIC
exports.createCategory = catchAsync(async (req, res, next) => {
  let category = await Category.create(req.body);
  res.status(200).json({
    status: 'success',
    category,
  });
});

//@desc Get all categories
//@route POST /api/v1/category/l
//access PUBLIC
exports.getAllCategories = catchAsync(async (req, res, next) => {
  let categories = await Category.find({});
  res.status(200).json({
    status: 'success',
    categories,
  });
});
