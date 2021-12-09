const AppError = require('../utils/appError');
const { format } = require('util');
const catchAsync = require('../utils/catchAsync');
const ErrorMsgs = require('./../utils/ErrorMsgsConstants');
const Product = require('../models/productModel');
const {
  handleStoringImageAndCreatingElement,
  handleUpdatingAndStoringElement,
} = require('../utils/firebaseStorage');
const { bucket } = require('../utils/firebaseConfiguration');

//@desc Create a product(EX: sandwich aw ay 7aga tanya momkn tb2a mawgoda f shop)
//@route POST /api/v1/products/:shopId/:subCategoryId ==> SubCategory represent any category inside the shop itself
//access PUBLIC
exports.createProduct = catchAsync(async (req, res, next) => {
  req.body.shop = req.query.shopId;
  req.body.subCategory = req.query.subCategoryId;
  handleStoringImageAndCreatingElement('products', req, res);
});

//@desc Get a product by id
//@route GET /api/v1/products/:id
//access PUBLIC
exports.getProductById = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.query.productId);
  res.status(200).json({
    status: 'success',
    product,
  });
});

//@desc Update a product by id
//@route UPDATE /api/v1/products/product
//access PUBLIC
exports.updateProductById = catchAsync(async (req, res, next) => {
  let { productId } = req.query;
  // handleUpdatingAndStoringElement('products', req, res, productId);
  if (!req.file) {
    console.log(req.body);
    let updatedElement = await Product.findOneAndUpdate(
      { _id: productId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      updatedElement,
    });
  } else {
    const blob = bucket.file(`${schemaType}/${req.file.originalname}`);
    const blobStream = blob.createWriteStream();
    blobStream.on('finish', async () => {
      // The public URL can be used to directly access the file via HTTP.
      publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
    });
    let photoUrl = `https://storage.googleapis.com/${bucket.name}/${schemaType}/${req.file.originalname}`;
    let wholeBody = { ...req.body, photo: photoUrl };

    let updatedElement = await Product.findOneAndUpdate(
      { _id: productId },
      wholeBody,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      updatedElement,
    });
    blobStream.end(req.file.buffer);
  }
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
