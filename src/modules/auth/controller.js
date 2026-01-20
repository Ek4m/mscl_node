const bcrypt = require("bcryptjs");

const User = require("../../entities/User");

const { SuccessResponse, ErrorResponse } = require("../common/helpers");
const { signJwt } = require("../jwt/helpers");
const { getRepo } = require("./helpers");

const register = async (req, res) => {
  const { email, password, role, username } = req.body;
  const userRepository = getRepo(User);
  const hashedPassword = await bcrypt.hash(password, 10);
  const userExists = await userRepository.findOne({
    where: [{ email }, { username }],
  });
  if (userExists)
    ErrorResponse(res, "User with given credentials already exists");
  const user = userRepository.create({
    email,
    password: hashedPassword,
    role,
    username,
  });
  await userRepository.save(user);
  delete user.password;
  const token = signJwt(user);
  SuccessResponse(res, { token, user });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const userRepository = getRepo(User);
  const user = await userRepository.findOneBy({ username });
  if (!user) return ErrorResponse(res, "Invalid username or password");
  const passwordValid = await bcrypt.compare(password, user.password);
  if (user && passwordValid) {
    const token = signJwt(user);
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
  delete user.password;
  SuccessResponse(res, { user });
};

module.exports = {
  register,
  login,
  profile,
};
