const Tour = require('../models/tourModel.js');
const AppError = require('../utils/appError.js');
// const APIFeatures = require('../utils/APIFeatures.js').default;
// const catchAsync = require('../utils/catchAsync.js');
const factory = require('./handlerFactory.js');

// get data from jsonText file
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8"));
// check if req has name , price prob act as middleware
// exports.checkBody = (req, res, next) => {if (!req.body.name||!req.body.price){res.status(400).json({status: 'failed',message:'notfound',})}next();};

// exports.aliasTopTours = (req, res, next) => {
//   req.query.limit = "5";
//   req.query.sort = "-price";
//   req.query.fields = "name,price,summary,ratingAverage";
//   console.log(req.query);
//   next();
// };

//const testTour = new Tour({name: "The Forest Hiker",rating: 4.7,price: 497}).save().then((doc) => console.log(doc)).catch((err) => console.log(err.message));

exports.getAlltours = factory.getAll(Tour); // APIFeatures

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

//* 52- post requests
// old way to save
// const testTour = new Tour({}) ,testTour.save().then()
exports.createTour = factory.createOne(Tour);

//* 55 - patch requests
exports.updateTour = factory.updateOne(Tour);

//* 56 - delete requests
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = async (req, res) => {
  try {
    // array of stages and do it step by step
    const stats = await Tour.aggregate([
      {
        // match => find tours which ratingsAverage >= 4.5
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // _id: null => All
          _id: '$ratingsAverage',
          numberOfTours: { $sum: 1 },
          numRating: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: {
          minPrice: 1, // 1: Ascending
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        tour: stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      data: err.message,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            // $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numberOfTours: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      { $project: { _id: 0 } }, // remove _id prob
      {
        $sort: { numberOfTours: -1 },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        tour: plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      data: err.message,
    });
  }
};
