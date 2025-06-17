const mongoose = require("mongoose");
const Tour = require("../models/tourModel.js");

// get data from jsonText file
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8"));
// check if req has name , price prob act as middleware
// exports.checkBody = (req, res, next) => {if (!req.body.name||!req.body.price){res.status(400).json({status: 'failed',message:'notfound',})}next();};

// this function for Advanced Filltering for getAllToures Request
function transformQuery(query) {
  // API REQUEST             { 'duration[gte]': '5', difficulty: 'easy' }
  // WHAT API SHOULD BE LIKE { duration: { $gte: '5' }, difficulty: 'easy' }
  const newQuery = {};
  Object.entries(query).forEach(([key, value]) => {
    const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);
    if (match) {
      const [, field, op] = match;
      newQuery[field] = { ...(newQuery[field] || {}), [`$${op}`]: value };
    } else {
      newQuery[key] = value;
    }
  });

  return newQuery;
}

//* 52- get requests
exports.getAlltours = async (req, res) => {
  try {
    // Filltering
    // Bulid Query
    const queryObj = { ...req.query }; // make hard copy to dont change the original object
    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced Filltering
    // gte , gt , lte , lt
    const transformedQuery = transformQuery(queryObj);
    let query = Tour.find(transformedQuery);

    // 2) Sorting
    // sort method work like this sort(price age)
    if (req.query.sort) {
      const sortedBy = req.query.sort.split(",").join(" "); //price maxGroupSize
      query = query.sort(sortedBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 3) filed limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v"); // every thing exclude __v
    }

    // 4) pagination
    // page 2 11 - 20, limit 10 skip 10
    // algorithm
    // skip ((page - 1) * limit)
    console.log(req.query);
    let page = req.query.page * 1;
    let limit = req.query.limit * 1;
    query = query.skip((page - 1) * limit).limit(limit);

    // const query =  Tour.find()
    //   .where("duration")
    //   .equals(5)
    //   .where("difficulty")
    //   .equals("easy");

    // Execute the query
    const tours = await query;

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
