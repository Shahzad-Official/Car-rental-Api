// errorHandler/errorHandler.js

function errorHandler(err, req, res, next) {
  try {
    
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || "Internal server error";

    // Send the response with the status code and error message
    return res.status(statusCode).json({ error: errorMessage });
  } catch (err) {
    console.log(err);
  }
}

module.exports = errorHandler;
