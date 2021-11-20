const express = require('express');
const router = express.Router(); //We created sub application for categories
const { uploadPhoto, resizePhoto } = require('../utils/multerConfiguration');
const {
  checkForIdExistenceAndValidityCategory,
} = require('../utils/checkForId');

const {
  createCategory,
  getAllCategories,
  deleteCategoryById,
} = require('../controllers/categoryController');

router
  .route('/category')
  .post(uploadPhoto, resizePhoto, createCategory)
  .delete(checkForIdExistenceAndValidityCategory, deleteCategoryById);
router.route('/').get(getAllCategories);

module.exports = router;
