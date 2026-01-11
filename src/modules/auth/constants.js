const JWT_SECRET =
  process.env.NODE_ENV === "production"
    ? process.env.JWT_SECRET
    : "local_super_secret_key";

module.exports = {
  JWT_SECRET,
};
