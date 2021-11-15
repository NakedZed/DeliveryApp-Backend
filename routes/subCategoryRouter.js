const express = require('express');
const router = express.Router(); //We created sub application for categories
const {
  createSubCategory,
  getAllSubCategories,
  getSubCategoriesForShop,
} = require('../controllers/subCategoryController');

router.route('/').post(createSubCategory).get(getAllSubCategories);
router.route('/shopSubCategories').get(getSubCategoriesForShop);

module.exports = router;
