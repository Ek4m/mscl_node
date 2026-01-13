const route = require("express").Router();
const { getPredictions } = require("./controller");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

route.post("/predict", upload.array("images", 6), getPredictions);

module.exports = route;
