/**
 * GLOBAL ERROR HANDLER
 * Enterprise-grade Express error handling middleware
 * Handles:
 *  - Validation errors
 *  - MongoDB errors
 *  - JWT errors
 *  - Custom business logic errors
 */

const errorHandler = (err, req, res, next) => {
    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
  
    /**
     * ===============================
     * MONGODB & MONGOOSE ERRORS
     * ===============================
     */
  
    // Duplicate key error (email already exists)
    if (err.code === 11000) {
      statusCode = 409;
      message = `Duplicate field value: ${Object.keys(err.keyValue).join(", ")}`;
    }
  
    // Mongoose validation error
    if (err.name === "ValidationError") {
      statusCode = 400;
      message = Object.values(err.errors)
        .map(val => val.message)
        .join(", ");
    }
  
    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
      statusCode = 400;
      message = `Invalid ${err.path}: ${err.value}`;
    }
  
    /**
     * ===============================
     * JWT AUTHENTICATION ERRORS
     * ===============================
     */
  
    // Invalid JWT
    if (err.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid authentication token";
    }
  
    // Expired JWT
    if (err.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Session expired. Please login again.";
    }
  
    /**
     * ===============================
     * CUSTOM BUSINESS LOGIC ERRORS
     * ===============================
     */
  
    // Custom error format support
    if (err.isOperational) {
      statusCode = err.statusCode;
      message = err.message;
    }
  
    /**
     * ===============================
     * RESPONSE
     * ===============================
     */
  
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
      }),
    });
  };
  
  export default errorHandler;
  