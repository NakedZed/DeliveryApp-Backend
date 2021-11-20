const express = require('express');
const router = express.Router(); //We created sub application for categories
const { uploadPhoto, resizePhoto } = require('../utils/multerConfiguration');

const {
  createCategory,
  getAllCategories,
} = require('../controllers/categoryController');

router
  .route('/')
  .post(uploadPhoto, resizePhoto, createCategory)
  .get(getAllCategories);

module.exports = router;
