const express = require('express');
const userController = require('../controllers/usercontroller.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.route('/forgetPassword').post(authController.forgetPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/').get(userController.getAllUsers);
router.route('/:id').get(userController.getUser);

router
  .route('/updateMe')
  .patch(authController.protect, userController.updateMe);
router
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteMe);

// export one thing only
module.exports = router;
