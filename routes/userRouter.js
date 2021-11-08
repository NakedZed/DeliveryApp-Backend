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

let {
  getAllUsers,
  getUserById,
  getUserByType,
} = require('./../controllers/userController');

//Passing uploaduserphoto and resizeuserphoto middlewares before signing up
router.post('/signup', uploadPhoto, resizePhoto, signup);
router.patch('/updateMyPassword', protect, updatePassword);
router.post('/loginWithPhone', loginWithPhone);
router.get('/type', getUserByType);

router.route('/').get(getAllUsers);
router.route('/user').get(getUserById);

module.exports = router;
