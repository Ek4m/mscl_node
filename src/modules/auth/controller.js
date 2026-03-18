const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../../entities/User");

const { SuccessResponse, ErrorResponse } = require("../common/helpers");
const { signJwt } = require("../jwt/helpers");
const { getRepo } = require("./helpers");
const PasswordReset = require("../../entities/PasswordReset");
const mailer = require("../../config/mailer/config");
const passwordKey = require("../../mail-templates/password-key");

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

const freeze = async (req, res) => {
  const repo = getRepo(User);
  const user = await repo.findOneBy({
    id: req.user.id,
  });
  await repo.update(user.id, { frozenAt: new Date() });
  SuccessResponse(res, { deteled: true });
};

const forgotPassword = async (req, res) => {
  const clientId = req.user.id;
  const userRepo = getRepo(User);
  const passwordResetRepo = getRepo(PasswordReset);
  const user = await userRepo.findOne({ where: { id: clientId } });
  const rawToken = crypto
    .randomBytes(4)
    .toString("hex")
    .slice(0, 6)
    .toUpperCase();

  await passwordResetRepo.delete({
    user: { id: clientId },
  });

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  await passwordResetRepo.save({
    user: { id: clientId },
    token: hashedToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 15 min
  });
  await mailer.sendMail({
    to: user.email,
    subject: "Forgot your password?",
    html: passwordKey(rawToken),
  });

  SuccessResponse(res, { success: true });
};

module.exports = {
  register,
  login,
  profile,
  freeze,
  forgotPassword,
};
