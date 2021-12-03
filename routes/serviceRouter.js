const express = require('express');
const router = express.Router(); //We created sub application for products
const {
  checkForIdExistenceAndValidityService,
} = require('../utils/checkForId');
const {
  createService,
  deleteServiceById,
  getAllServices,
  updateServiceById,
  getServiceById,
} = require('../controllers/serviceController');

router.route('/').get(getAllServices);
router
  .route('/service')
  .post(createService)
  .get(checkForIdExistenceAndValidityService, getServiceById)
  .delete(checkForIdExistenceAndValidityService, deleteServiceById)
  .patch(checkForIdExistenceAndValidityService, updateServiceById);

module.exports = router;
