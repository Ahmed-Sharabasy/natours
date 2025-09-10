const Tour = require('../models/tourModel.js');
const AppError = require('../utils/appError.js');
const APIFeatures = require('../utils/APIFeatures.js').default;
const catchAsync = require('../utils/catchAsync.js');

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

exports.getAlltours = catchAsync(async (req, res) => {
  // const query =Tour.find().where("duration").equals(5).where("difficulty").equals("easy");
  // Execute the query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  if (!tours) {
    return next(new AppError(err.message, 404));
  }

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const id = req.params.id; // { id: '2' }
  const tour = await Tour.findById(id).populate('reviews');
  // Tour.findOne({_id:req.params.id})
  if (!tour) {
    // return res.status(404).json({
    //   status: "fail",
    //   message: "invalid or not found ID",
    // });
    return next(new AppError('invalid or not found ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { tour },
    id,
  });
});

//* 52- post requests
exports.createTour = catchAsync(async (req, res, next) => {
  // old wae to save
  // const testTour = new Tour({})
  // testTour.save().then()
  // better
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newTour,
    },
  });
});

//* 55 - patch requests
exports.updateTour = catchAsync(async (req, res, next) => {
  // oldTour =await Tour.findById(req.params.id)
  // oldTour.name = req.params.name
  // newTour = Tour.create(req.params)
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
});

//* 56 - delete requests
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'faild',
      data: err.message,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    // array of statges and do it step by step
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
          minPrice: 1, // 1: Assending
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
      status: 'faild',
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
      status: 'faild',
      data: err.message,
    });
  }
};
