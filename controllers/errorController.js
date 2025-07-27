const AppError = require("../utils/appError.js");

sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    error: err,
    Error_Stack: err.stack,
    message: err.message,
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

sendErrorProd = (err, res) => {
  // Send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      from: "Iam from globalErrorHandler",
    });
    // Programming Error  or error in 3rd party library or any thing we dont know
  } else {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "devolopment") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if ((error.name = "CastError")) error = handleCastErrorDB(error);
    sendErrorProd(err, res);
  }
};
