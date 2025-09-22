const Review = require('../Models/reviewModel.js');
const factory = require('./handlerFactory.js');

//? create a middleware run to init req.body.user , tour before createReview func
exports.setTourUserIds = (req, res, next) => {
  // this for nested route , if we not defied them
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};
exports.createReview = factory.createOne(Review);

// Get all reviews
//? this need filter puted in factory as a bug!
// let filter = {};  if (req.params.tourId) filter = { tour: req.params.tourId };
exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
