const { ErrorResponse } = require("./helpers");

const errorHandler = (err, req, res, next) => {
  console.error("LOG [Error]:", err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return ErrorResponse(res, message, statusCode);
};

module.exports = {
  errorHandler,
};
