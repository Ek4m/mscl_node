const route = require("express").Router();
const multer = require("multer");

const { getEquipments, generateProgram } = require("./controller");
const { validateSchema } = require("../auth/middlewares");
const { generateProgramSchema } = require("./schemas");

const upload = multer({ storage: multer.memoryStorage() });

route.post("/detect", upload.array("images", 6), getEquipments);
route.post("/generate-program", validateSchema(generateProgramSchema), generateProgram);

module.exports = route;
