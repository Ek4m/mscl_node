const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../auth/constants");

console.log("___________",JWT_SECRET)

const signJwt = (user, options = {}) =>
  jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "14d",
    ...options,
  });

const verifyJwt = (token) => jwt.verify(token, JWT_SECRET);

module.exports = {
  signJwt,
  verifyJwt,
};
