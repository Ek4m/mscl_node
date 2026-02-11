const { ErrorResponse } = require("./helpers");

const errorHandler = (err, req, res, next) => {
  console.error("LOG [Error]:", err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return ErrorResponse(res, message, statusCode);
};

const logger = (req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  if (["post", "put", "patch"].includes(req.method.toLowerCase()))
    console.log(req.body);
  console.log("______________________________________________________________");
  next();
};

module.exports = {
  errorHandler,
  logger,
};
