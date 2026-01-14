const route = require("express").Router();
const { authorize } = require("../auth/middlewares");
const { getPredictions } = require("./controller");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

route.post("/predict", authorize(), upload.array("images", 6), getPredictions);

module.exports = route;
