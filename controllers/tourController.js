const mongoose = require("mongoose");
const Tour = require("../models/tourModel.js");
const APIFeatures = require("../utils/APIFeatures.js").default;

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

exports.getAlltours = async (req, res) => {
  try {
    // const query =Tour.find().where("duration").equals(5).where("difficulty").equals("easy");

    // Execute the query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  const id = req.params.id; // { id: '2' }
  const tour = await Tour.findById(id);
  // Tour.findOne({_id:req.params.id})
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "invalid or not found ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: { tour },
    id,
  });
};

//* 52- post requests
exports.createTour = async (req, res) => {
  try {
    // old wae to save
    // const testTour = new Tour({})
    // testTour.save().then()
    // better
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

//* 55 - patch requests
exports.updateTour = async (req, res) => {
  try {
    // oldTour =await Tour.findById(req.params.id)
    // oldTour.name = req.params.name
    // newTour = Tour.create(req.params)
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "faild",
      message: err.message,
    });
  }
};

//* 56 - delete requests
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "faild",
      data: err.message,
    });
  }
};
