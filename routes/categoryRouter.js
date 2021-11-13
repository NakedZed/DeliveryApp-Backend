const express = require('express');
const router = express.Router(); //We created sub application for categories
const {
  createCategory,
  getAllSubCategories,
  getAllCategories,
} = require('../controllers/categoryController');

router.route('/').post(createCategory).get(getAllCategories);
router.route('/subCategories').get(getAllSubCategories);

module.exports = router;
