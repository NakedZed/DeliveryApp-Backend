const express = require('express');
const router = express.Router(); //We created sub application for products
const { protect } = require('./../controllers/authController');
const { uploadPhoto, resizePhoto } = require('../utils/multerConfiguration');
const {
  createService,
  getAllServices,
} = require('../controllers/serviceController');

router.route('/').get(getAllServices);
router.route('/service').post(createService);

module.exports = router;
