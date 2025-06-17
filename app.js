const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// using middleware 53
// app.use((req, res, next) => {next()});
app.use(express.json());
// in morgan fun it return fun((req, res, next))
app.use(morgan("dev"));

// read static files
app.use(express.static(`${__dirname}/public`));
// app.use(express.static(`./public`));

// app.get('/api/v1/tours', getAlltours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
