const bcrypt = require("bcryptjs");

const AppDataSource = require("../../../db/init");
const User = require("../../../entities/User");
const { signJwt } = require("../jwt/helpers");
const { JWT_SECRET } = require("./constants");
const { SuccessResponse, ErrorResponse } = require("../common/helpers");
const { getRepo } = require("./helpers");

const register = async (req, res) => {
  const { email, password, role, username } = req.body;
  const userRepository = getRepo(User);
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userRepository.create({
    email,
    password: hashedPassword,
    role,
    username,
  });
  delete user.password;
  await userRepository.save(user);
  const token = signJwt({ id: user.id, role: user.role }, {
    expiresIn: "7d",
  });
  SuccessResponse(res, { token, user });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const userRepository = getRepo(User);
  const user = await userRepository.findOneBy({ username });
  if (!user) return ErrorResponse(res, "Invalid username or password");
  const passwordValid = await bcrypt.compare(password, user.password);
  if (user && passwordValid) {
    const token = signJwt({ id: user.id, role: user.role }, {
      expiresIn: "1h",
    });
    delete user.password;
    SuccessResponse(res, { token, user });
  } else {
    ErrorResponse(res, "Invalid username or password");
  }
};

const profile = async (req, res) => {
  const user = await getRepo(User).findOneBy({
    id: req.user.id,
  });
  SuccessResponse(res, { user });
};

module.exports = {
  register,
  login,
  profile,
};
