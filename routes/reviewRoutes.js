const express = require('express');
const authController = require('../controllers/authController.js');
const reviewController = require('../controllers/reviewController.js');

// mergeParams allow reviewRoutes to read parameters from other route
const router = express.Router({ mergeParams: true });

// this now will work if route is like this or that
// tours/1544id/reviews
// /reviews

// this will handel this router.use('/:tourId/reviews', reviewRoutes); which come from tourroute
router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
