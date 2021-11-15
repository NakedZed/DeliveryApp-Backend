const express = require('express');
const router = express.Router(); //We created sub application for categories
const {
  createCategory,
  getAllCategories,
} = require('../controllers/categoryController');

router.route('/').post(createCategory).get(getAllCategories);

module.exports = router;
