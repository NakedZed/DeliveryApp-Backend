const express = require('express');
const router = express.Router(); //We created sub application for users
const app = require('../app');
const { uploadPhoto, resizePhoto } = require('./../controllers/userController');
const {
  signup,
  updatePassword,
  protect,
  loginWithPhone,
} = require('./../controllers/authController');

//Passing uploaduserphoto and resizeuserphoto middlewares before signing up
router.post('/signup', uploadPhoto, resizePhoto, signup);
router.patch('/updateMyPassword', protect, updatePassword);
router.post('/loginWithPhone', loginWithPhone);
module.exports = router;
