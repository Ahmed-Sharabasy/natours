const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

// console.log(app.get('env'));
// console.log(process.env);
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// this for connecting atls db
mongoose
  .connect(DB, {
    // to skip warling and other during devolopment
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log("database connected successful");
  });

//const testTour = new Tour({name: "The Forest Hiker",rating: 4.7,price: 497}).save().then((doc) => console.log(doc)).catch((err) => console.log(err.message));

// to connect local db
// mongoose
//   .connect(process.env.DATABASE_LOCAL, {
//     // to skip warling and other during devolopment
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then((con) => {
//     // console.log(con.connections);
//     console.log("database connected successful");
//   });

const port = process.env.PORT || 3000;
// Start The server
app.listen(port, () => {
  console.log(`Server Is Running on port ${port}`);
});
