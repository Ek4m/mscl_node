const isDev = process.env.NODE_ENV.trim() === "dev";
console.log(isDev)
module.exports = {
  isDev,
};
