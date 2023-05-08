// errorHandler/errorHandler.js

function errorHandler(err, req, res, next) {
    // Log the error for debugging purposes
    
  
    // Handle specific types of errors
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal server error';
  
    // Send the response with the status code and error message
    return res.status(statusCode).json({ error: errorMessage });
  }
  
  module.exports = errorHandler;
  