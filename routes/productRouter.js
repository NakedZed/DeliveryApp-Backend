const express = require('express');
const router = express.Router(); //We created sub application for products
const ErrorMsgs = require('../utils/ErrorMsgsConstants');
const { protect } = require('./../controllers/authController');
const {
  createProduct,
  updateProductById,
  getProductById,
  deleteProductById,
  getProductsForAShop,
} = require('../controllers/productController');

const {
  checkForIdExistenceAndValidityProduct,
} = require('../utils/checkForId');

router
  .route('/product')
  .patch(checkForIdExistenceAndValidityProduct, updateProductById)
  .delete(checkForIdExistenceAndValidityProduct, deleteProductById);
router.route('/productsForShop').get(getProductsForAShop);
router.route('/:shopId/:subCategoryId').post(createProduct); // Add product by adding shopId for it and the subcategory(DRINK or anything..)
router.route('/:id').get(getProductById); //Get product by id

module.exports = router;
