class AppError extends Error {
  // Class For Operational Errors
  constructor(message, statusCode) {
    super(message); // to save prob of Error Class
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // All Errors that we create by ourselfs
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
