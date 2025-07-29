const AppError = require("../utils/appError.js");

// DEV
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// PROD
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      from: "Iam from globalErrorHandler",
    });
  }

  // Unknown/Programming error
  // Programming Error  or error in 3rd party library or any thing we dont know
  console.error("ERROR 💥", err);
  return res.status(500).json({
    status: "error",
    message: "somthing went wrong!",
  });
};

// Known error transformers
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
  new AppError("Token is invalid or user not found", 401);

const handleTokenExpiredError = () =>
  new AppError("Your token has expired. Please log in again.", 401);

// Global error handler
module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err); // avoid double-send

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const env = process.env.NODE_ENV;

  if (env === "development") {
    return sendErrorDev(err, res);
  }

  if (env === "production") {
    // Copy while preserving key properties
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.code = err.code;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJsonWebTokenError();
    if (error.name === "TokenExpiredError") error = handleTokenExpiredError();

    return sendErrorProd(error, res);
  }

  // Fallback (if NODE_ENV is not set correctly)
  return sendErrorDev(err, res);
};
