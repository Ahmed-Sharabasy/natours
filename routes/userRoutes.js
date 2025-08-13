const express = require('express');
const userController = require('../controllers/userController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.route('/forgetPassword').post(authController.forgetPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/').get(userController.getAllUsers);
router.route('/:id').get(userController.getUser);

// export one thing only
module.exports = router;
