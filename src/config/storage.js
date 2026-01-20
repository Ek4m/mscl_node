const { v2 } = require("cloudinary");

v2.config({
  cloud_name: process.env.STORAGE_CN,
  api_key: process.env.STORAGE_APIK,
  api_secret: process.env.STORAGE_APIS,
});

module.exports = v2;
