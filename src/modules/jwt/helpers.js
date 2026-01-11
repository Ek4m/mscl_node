const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../auth/constants");

const signJwt = (payload, options) => jwt.sign(payload, JWT_SECRET, options);

const verifyJwt = (token) => jwt.verify(token, JWT_SECRET);

module.exports = {
  signJwt,
  verifyJwt,
};
