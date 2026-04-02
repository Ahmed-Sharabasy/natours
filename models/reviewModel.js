const mongoose = require('mongoose');
const Tour = require('./tourModel.js');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      required: [true, 'Review must have a rating'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    // Ensures that virtual properties are included when output as JSON or Objects
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// prevent duplicate reviews by craete unique index
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({path: 'tour',select: 'name',}).populate({path: 'user',select: 'name',});
  this.populate({
    path: 'user',
    select: 'name',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const tours = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avrgRatings: { $avg: '$rating' },
      },
    },
  ]);
  console.log(tours);
  if (tours.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: tours[0].nRating,
      ratingsAverage: tours[0].avrgRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// calcAverageRatings on tour after posted it in mongodb
reviewSchema.post('save', function () {
  // this point to curr doc which beaing save right now
  // this.constructor instad of Review
  this.constructor.calcAverageRatings(this.tour);
});

// calcAverageRatings after findOneAndUpdate , findOneAndDelete methods
// pre ? before save doc save it in r to access it later
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.model.findOne();
  console.log(this.r);
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
