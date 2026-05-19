function errorHandler(err, req, res, next) {
  console.error(err.message); // Log the error message for debugging

  res.status(500).send("Internal Server Error"); // Send a generic error response to the client
}

module.exports = errorHandler; // Export the error handler to be used in the main app
