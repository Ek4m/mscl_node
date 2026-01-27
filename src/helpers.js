const isDev = process.env.NODE_ENV.trim() === "dev";
console.log("IS DEVELOPMENT? ", isDev);
module.exports = {
  isDev,
};
