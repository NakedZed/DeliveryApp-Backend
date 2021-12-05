const express = require('express');
const router = express.Router(); //We created sub application for products
const { protect } = require('./../controllers/authController');

const { checkForIdExistenceAndValidityUser } = require('../utils/checkForId');
const {
  getFavoriteShopsForUser,
  modifyFavoriteShops,
} = require('../controllers/favoriteController');

router
  .route('/favorite')
  .get(checkForIdExistenceAndValidityUser, getFavoriteShopsForUser)
  .patch(modifyFavoriteShops);

module.exports = router;
