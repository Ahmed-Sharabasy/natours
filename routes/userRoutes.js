const express = require('express');
const userController = require('../controllers/userController.js');
const authController = require('../controllers/authController.js');
const { patch } = require('./reviewRoutes.js');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgetPassword').post(authController.forgetPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

//protect all routes after this middlewares
router.use(authController.protect);

router.route('/updatePassword').patch(authController.updatePassword);
router.route('/Me').get(userController.getMe, userController.getUser);
router.route('/updateMe').patch(userController.updateMe);
router.route('/deleteMe').delete(userController.deleteMe);

// restrict all routes To admin after this middleware and protected midd also work
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

// export one thing only
module.exports = router;
