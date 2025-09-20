const AppError = require('../utils/appError');

// return function do this! understand the idea?
exports.deleteOne = (Model) => async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('No Model found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// UpdateOne
exports.updateOne = (Model) => async (req, res, next) => {
  // oldTour =await Tour.findById(req.params.id)
  // oldTour.name = req.params.name
  // newTour = Tour.create(req.params)
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) return next(new AppError('there is no document', 404));
  res.status(200).json({
    status: 'success',
    data: {
      tour: doc,
    },
  });
};

// Old One
// exports.deleteOne = async (req, res, next) => {
//   const doc = await Tour.findByIdAndDelete(req.params.id);

//   if (!doc) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };

exports.createOne = (Model) => async (req, res, next) => {
  // old wae to save
  // const testTour = new Tour({})
  // testTour.save().then()
  // better
  const doc = await Model.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
};
