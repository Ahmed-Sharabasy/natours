const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./controllers/errorController.js");

const app = express();

// using middleware 53
// app.use((req, res, next) => {next()});
app.use(express.json());
// in morgan fun it return fun((req, res, next))
app.use(morgan("dev"));

// read static files
app.use(express.static(`${__dirname}/public`));
// app.use(express.static(`./public`));

// ROUTING
// app.get('/api/v1/tours', getAlltours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// app.all("*name", (req, res, next) => {
//   next(new AppError("cant find the url ", 404));
// });

app.use(globalErrorHandler);

module.exports = app;
