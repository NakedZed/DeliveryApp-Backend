const express = require('express');
const router = express.Router(); //We created sub application for shops
const { protect } = require('./../controllers/authController');
const {
  createShop,
  getAllShops,
  getShopById,
  getShopsByCategory,
  deleteShopById,
} = require('../controllers/shopController');
const {
  checkForIdExistenceAndValidityShop,
  checkForIdExistenceAndValidityCategory,
} = require('../utils/checkForId');

router.get(
  '/shopsForCategory',
  checkForIdExistenceAndValidityCategory,
  getShopsByCategory
); //Get all shops by a category ID
router.route('/').get(getAllShops);
router
  .route('/shop')
  .get(checkForIdExistenceAndValidityShop, getShopById)
  .post(protect, checkForIdExistenceAndValidityCategory, createShop) //add a shop and specify a category for it or getting a specific shop
  .delete(checkForIdExistenceAndValidityShop, deleteShopById);

module.exports = router;
