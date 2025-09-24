const express = require('express');
const authController = require('../controllers/authController.js');
const reviewController = require('../controllers/reviewController.js');

// mergeParams allow reviewRoutes to read parameters from other route
const router = express.Router({ mergeParams: true });

// this now will work if route is like this or that
// tours/1544id/reviews
// /reviews

// this will handel this router.use('/:tourId/reviews', reviewRoutes); which come from tourroute
router.use(authController.protect);
router.route('/').get(reviewController.getAllReviews).post(
  authController.restrictTo('user'),
  reviewController.setTourUserIds, // define req.user, req.tour Ids before create Review Fun
  reviewController.createReview
);

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  );

module.exports = router;
