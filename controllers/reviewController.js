const Review = require('../Models/reviewModel.js');
const factory = require('./handlerFactory.js');

// Get all reviews
exports.getAllReviews = async (req, res) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);
  // .populate('user', 'name') // يجيب بيانات اليوزر (مثلاً الاسم)
  // .populate('tour', 'name'); // يجيب بيانات التور (مثلاً الاسم)

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
};
// create a middleware run to init req.body.user , tour before createReview func
exports.setTourUserIds = (req, res, next) => {
  // this for nested route , if we not defied them
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};

// Create a new review
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
