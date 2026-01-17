const route = require("express").Router();
const multer = require("multer");

const {
  getEquipments,
  generateProgram,
  getUsersPlans,
  getPlanById,
} = require("./controller");
const { validateSchema } = require("../auth/middlewares");
const { generateProgramSchema } = require("./schemas");

const upload = multer({ storage: multer.memoryStorage() });

route.post("/detect", upload.array("images", 6), getEquipments);
route.get("/plans", getUsersPlans);
route.get("/plans/:id", getPlanById);
route.post(
  "/generate-program",
  validateSchema(generateProgramSchema),
  generateProgram,
);

module.exports = route;
