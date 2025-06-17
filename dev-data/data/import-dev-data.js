const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel.js");

dotenv.config({ path: "./../../config.env" });

const DB = process.env.DATABASE
  ? process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
  : "mongodb+srv://ahmed:0000@cluster0.86u9rks.mongodb.net/natours";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("database connected successful"));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("database is created successfully");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("data is deleted successfully");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

// const results = tours.map((el) => {
//   const { id, ...rest } = el;
//   return rest;
// });
// console.log(results);
