const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');
// const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'enter less than 40'],
      // validate: [validator.isAlpha, "tour name must only contain charachter"], // 3rd party libirary
    },
    slug: String,
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must Group Size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: ['easy', 'medium', 'difficult'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: 'discount must be lower than price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    discription: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a Cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guieds: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Create Indexes In MongoDB ? it hepls with proformance when excute a query
tourSchema.index({ slug: 1 }); // Assinding order

// Bulid Virtual prob
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//?very Important Bulid Virtual prob
tourSchema.virtual('reviews', {
  ref: 'Review', // Review Model
  foreignField: 'tour', // filed you created in Review schema to store tourID
  localField: '_id', // ID of Tour in db
});

// Doucument MIDDLEWARE

// tourSchema.pre('save', async function (next) {
//   const guidesPromise = this.guieds.map(async (id) => await User.findById(id));
//   this.guieds = await Promise.all(guidesPromise)next()});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guieds',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  // before entere aggregatefunction in tourcontrller it will match only maxGroupSize >= 10
  this.pipeline().unshift({
    $match: { maxGroupSize: { $gte: 10 } },
  });
  console.log(this);
  next();
});

// const Tour = mongoose.model('Tour', tourSchema);
const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

module.exports = Tour;
