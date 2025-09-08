const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const globalErrorHandler = require('./controllers/errorController.js');
const ExpressMongoSanitize = require('express-mongo-sanitize');
const sanitizeHtml = require('sanitize-html');
const hpp = require('hpp');

const app = express();

// using Global middleware 53, Ex: app.use((req, res, next) => {next()});

// save app from attaks , ..... by sitting http hedears
app.use(helmet());

// Body parser, reading data from req.body like in postman
app.use(express.json());

// Data sanitization against NoSQL query injection
// app.use(ExpressMongoSanitize()); // like "email": { "$gt": "" },

// Data sanitization against XSS attakes
// app.use(sanitizeHtml())
// app.use(hpp()); // clean query string like ?sort=price&sort=price

// write the Method,  url , statusCode , Time
app.use(morgan('dev'));

// limmiter function => limit number of request ber IP user
const limiter = rateLimit({
  max: 335, /// max num of request
  windowMs: 60 * 60 * 1000, // ber how much time ber mile second -> 1 hour
  message: 'Too many request from this IP, please try again later in 1 hour',
});
app.use('/api', limiter);

// read static files
app.use(express.static(`${__dirname}/public`));
// app.use(express.static(`./public`));

// ROUTING
// app.get('/api/v1/tours', getAlltours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers, req.requestTime);
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/review', reviewRoutes);

// app.all("*name", (req, res, next) => {next(new AppError("cant find the url ", 404))});

app.use(globalErrorHandler);

module.exports = app;
