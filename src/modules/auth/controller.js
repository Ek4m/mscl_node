const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../../entities/User");

const { SuccessResponse, ErrorResponse } = require("../common/helpers");
const { signJwt } = require("../jwt/helpers");
const { getRepo } = require("./helpers");
const PasswordReset = require("../../entities/PasswordReset");
const mailer = require("../../config/mailer/config");
const passwordKey = require("../../mail-templates/password-key");
const { SALT_PASS } = require("./constants");

const register = async (req, res) => {
  const { email, password, role, username } = req.body;
  const userRepository = getRepo(User);
  const hashedPassword = await bcrypt.hash(password, SALT_PASS);
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
  const userRepo = getRepo(User);
  const passwordResetRepo = getRepo(PasswordReset);
  const email = req.body.email;
  if (!email) throw new Error("User not found");
  const user = await userRepo.findOne({ where: { email } });
  if (!user) throw new Error("User not found");
  const rawToken = crypto
    .randomBytes(4)
    .toString("hex")
    .slice(0, 6)
    .toUpperCase();

  await passwordResetRepo.delete({
    user: { id: user.id },
  });
  await passwordResetRepo.save({
    user: { id: user.id },
    token: rawToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 5),
  });
  await mailer.sendMail({
    to: user.email,
    subject: "Forgot your password?",
    html: passwordKey(rawToken),
  });

  SuccessResponse(res, { success: true });
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const passwordResetRepo = getRepo(PasswordReset);
  const userRepo = getRepo(User);
  const tokenFound = await passwordResetRepo.findOne({
    where: { token },
    relations: {
      user: true,
    },
  });
  if (!tokenFound) throw new Error("Token is not valid!");
  const user = await userRepo.findOne({
    where: { id: tokenFound.user.id },
  });

  if (!user) throw new Error("User was not found");
  if (user.expiresAt < new Date()) throw new Error("Token expired!");
  const hashedPassword = await bcrypt.hash(newPassword, SALT_PASS);
  user.password = hashedPassword;
  await userRepo.save(user);
  await passwordResetRepo.delete({ user });
  SuccessResponse(res, true);
};

const changePassword = async (req, res) => {
  const { password, newPassword } = req.body;
  const userId = req.user.id;
  const userRepo = getRepo(User);
  const user = await userRepo.findOne({
    where: { id: userId },
    select: ["id", "password"],
  });
  if (!user) throw new Error("User was not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  const hashedPassword = await bcrypt.hash(newPassword, SALT_PASS);

  user.password = hashedPassword;
  await userRepo.save(user);

  return SuccessResponse(res, { message: "Password updated successfully" });
};

module.exports = {
  register,
  login,
  profile,
  freeze,
  forgotPassword,
  resetPassword,
  changePassword,
};
