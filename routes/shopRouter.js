const express = require('express');
const router = express.Router(); //We created sub application for shops
const { protect } = require('./../controllers/authController');
const {
  createShop,
  getAllShops,
  getShopById,
  getShopsByCategory,
  getSubCategoriesForShop,
} = require('../controllers/shopController');

router.route('/subCategories').get(getSubCategoriesForShop);
router.get('/shopsForCategory', getShopsByCategory); //Get all shops by a category ID
router.route('/').get(getAllShops);
router.route('/:shopId').get(getShopById);
router.route('/:categoryId').post(protect, createShop).get(getShopsByCategory); //add a shop and specify a category for it

module.exports = router;
