const { ZodError } = require("zod");
const { verifyJwt } = require("../jwt/helpers");
const { ErrorResponse } = require("../common/helpers");

const authorize = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      ErrorResponse(res, "No token provided", 401);
    } else {
      try {
        const decoded = verifyJwt(token);
        if (roles.length && !roles.includes(decoded.role))
          ErrorResponse(res, "Forbidden", 401);
        req.user = decoded;
        next();
      } catch (err) {
        ErrorResponse(res, "Invalid token", 401);
      }
    }
  };
};

const validateSchema = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body);
    req.body = parsedBody;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      ErrorResponse(
        res,
        error.issues.map((e) => e.message),
        400
      );
    } else {
      ErrorResponse(res, "Something went wrong", 500);
    }
  }
};

module.exports = {
  authorize,
  validateSchema,
};
