const AppError = require('../utils/appError');
const { format } = require('util');
const catchAsync = require('../utils/catchAsync');
const ErrorMsgs = require('./../utils/ErrorMsgsConstants');
const Product = require('../models/productModel');

//@desc Create a product(EX: sandwich aw ay 7aga tanya momkn tb2a mawgoda f shop)
//@route POST /api/v1/products/:shopId/:subCategoryId ==> SubCategory represent any category inside the shop itself
//access PUBLIC
exports.createProduct = catchAsync(async (req, res, next) => {
  req.body.shop = req.query.shopId;
  req.body.subCategory = req.query.subCategoryId;
  let product = await Product.create(req.body);
  res.status(200).json({
    status: 'success',
    product,
  });
});

//@desc Get a product by id
//@route GET /api/v1/products/:id
//access PUBLIC
exports.getProductById = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.query.id)
    .populate('shop')
    .populate('subCategory')
    .exec();

  res.status(200).json({
    status: 'success',
    product,
  });
});

//@desc Update a product by id
//@route UPDATE /api/v1/products/product
//access PUBLIC
exports.updateProductById = catchAsync(async (req, res, next) => {
  let updatedProduct = await Product.findOneAndUpdate(
    { _id: req.query.productId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate('subCategory')
    .populate('shop');

  res.status(200).json({
    status: 'success',
    updatedProduct,
  });
});

//@desc Delete a product by id
//@route DELETE /api/v1/products/product
//access PUBLIC
exports.deleteProductById = catchAsync(async (req, res, next) => {
  let { productId } = req.query;
  let deletedProduct = await Product.findOneAndDelete({ _id: productId });
  res.status(200).json({
    status: 'success',
    deletedProduct,
  });
});

//@desc Get a products for a shop by passing shop id
//@route GET /api/v1/products/productsForShop
//access PUBLIC
exports.getProductsForAShop = catchAsync(async (req, res, next) => {
  let products = await Product.find({ shop: req.query.shopId });
  res.status(200).json({
    status: 'success',
    products,
  });
});
