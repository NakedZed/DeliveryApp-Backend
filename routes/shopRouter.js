const express = require('express');
const router = express.Router(); //We created sub application for shops
const { protect } = require('./../controllers/authController');
const { createShop, getAllShops } = require('../controllers/shopController');

router.route('/').post(protect, createShop).get(getAllShops);

module.exports = router;
