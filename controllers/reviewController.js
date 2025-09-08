const Review = require('../Models/reviewModel.js');

// Get all reviews
exports.getAllReviews = async (req, res) => {
  const reviews = await Review.find();
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
