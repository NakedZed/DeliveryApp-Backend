const express = require('express');
const router = express.Router(); //We created sub application for users

const { uploadPhoto, resizePhoto } = require('../utils/multerConfiguration');
const {
  signup,
  updatePassword,
  protect,
  loginWithPhone,
} = require('./../controllers/authController');

let {
  getAllUsers,
  getUserById,
  getUserByType,
  updateUserById,
  getUsersByService,
  updateNotificationToken,
} = require('./../controllers/userController');

let { checkForIdExistenceAndValidityService } = require('../utils/checkForId');

//Passing uploaduserphoto and resizeuserphoto middlewares before signing up
router.post('/signup', uploadPhoto, resizePhoto, signup);
router.patch('/updateMyPassword', protect, updatePassword);
router.post('/loginWithPhone', loginWithPhone);
router.get('/type', getUserByType);
router.get(
  '/service',
  checkForIdExistenceAndValidityService,
  getUsersByService
);

// Endpoint for updating the token
router.patch('/notificationToken', updateNotificationToken);

router.route('/').get(getAllUsers);
router
  .route('/user')
  .get(getUserById)
  .patch(uploadPhoto, resizePhoto, updateUserById);

module.exports = router;
