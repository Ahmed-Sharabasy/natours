const express = require('express');
const authController = require('../controllers/authController.js');
const reviewController = require('../controllers/reviewController.js');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(reviewController.createReview);

module.exports = router;
