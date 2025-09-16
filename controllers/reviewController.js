const Review = require('../Models/reviewModel.js');

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

// Create a new review
exports.createReview = async (req, res) => {
  // this for nested route , if we not defied them
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;

  const newReview = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req.body.user,
  });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
};
