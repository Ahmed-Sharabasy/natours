const express = require('express');
const tourController = require('../controllers/tourcontroller.js');
const authController = require('../controllers/authController.js');
// const reviewController = require('../controllers/reviewController.js');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();
// router.param('id', tourController.checkId);

// implement nested routes
// tours/1544id/reviews
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

//? Nested Routes with express
router.use('/:tourId/reviews', reviewRoutes);

// router
//   .route("/top-5-cheap")
//   .get(tourController.aliasTopTours, tourController.getAlltours);
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/')
  .get(tourController.getAlltours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// export one thing only
module.exports = router;
