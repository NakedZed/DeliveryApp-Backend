const express = require('express');
const router = express.Router(); //We created sub application for quickOrders
const { protect } = require('./../controllers/authController');
const {
  addQuickOrder,
  deleteQuickOrder,
  getQuickOrderById,
  updateQuickOrder,
  getQuickOrdersForDelivery,
} = require('./../controllers/quickOrderController');

const {
  checkForIdExistenceAndValidityQuickOrder,
} = require('./../utils/checkForId');

router
  .route('/')
  .post(addQuickOrder)
  .delete(checkForIdExistenceAndValidityQuickOrder, deleteQuickOrder)
  .patch(checkForIdExistenceAndValidityQuickOrder, updateQuickOrder);

router.get(
  '/quickOrder',
  checkForIdExistenceAndValidityQuickOrder,
  getQuickOrderById
);

router.route('/quickOrdersForDelivery').get(getQuickOrdersForDelivery);

module.exports = router;
