const { ZodError } = require("zod");
const { verifyJwt } = require("../jwt/helpers");
const { ErrorResponse } = require("../common/helpers");

const authorize = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) ErrorResponse(res, "No token provided", 401);
    try {
      const decoded = verifyJwt(token);
      if (roles.length && !roles.includes(decoded.role))
        ErrorResponse(res, "Forbidden", 401);
      req.user = decoded;
      next();
    } catch (err) {
      ErrorResponse(res, "Invalid token", 401);
    }
  };
};

const validateSchema = (schema) => async (req, res, next) => {
  try {
    // Validate the body
    const parsedBody = await schema.parseAsync(req.body);
    // Overwrite with cleaned data (removes extra fields)
    req.body = parsedBody;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error);
      ErrorResponse(
        res,
        error.errors.map((e) => e.message),
        400
      );
    }
    ErrorResponse(res, "Something went wrong", 500);
  }
};

module.exports = {
  authorize,
  validateSchema,
};
