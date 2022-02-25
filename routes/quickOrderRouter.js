const express = require('express');
const router = express.Router(); //We created sub application for quickOrders
const { uploadPhoto, resizePhoto } = require('../utils/multerConfiguration');
const { protect } = require('./../controllers/authController');
const {
  addQuickOrder,
  deleteQuickOrder,
  getQuickOrderById,
  updateQuickOrder,
  getQuickOrdersForDelivery,
  getAllQuickOrders,
  deleteMultipleQuickOrders,
} = require('./../controllers/quickOrderController');

const {
  checkForIdExistenceAndValidityQuickOrder,
} = require('./../utils/checkForId');

router
  .route('/')
  .post(uploadPhoto, resizePhoto, addQuickOrder)
  .delete(checkForIdExistenceAndValidityQuickOrder, deleteQuickOrder)
  .patch(
    uploadPhoto,
    resizePhoto,
    checkForIdExistenceAndValidityQuickOrder,
    updateQuickOrder
  )
  .get(getAllQuickOrders);

router.get(
  '/quickOrder',
  checkForIdExistenceAndValidityQuickOrder,
  getQuickOrderById
);

router.delete('/deleteMany', deleteMultipleQuickOrders);

router.route('/quickOrdersForDelivery').get(getQuickOrdersForDelivery);

module.exports = router;
