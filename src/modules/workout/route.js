const route = require("express").Router();
const uploader = require("../../config/multer/init");

const {
  getEquipments,
  generateProgram,
  getUsersPlans,
  getPlanById,
} = require("./controller");
const { validateSchema } = require("../auth/middlewares");
const { generateProgramSchema } = require("./schemas");

route.post("/detect", uploader.array("images", 6), getEquipments);
route.get("/plans", getUsersPlans);
route.get("/plans/:id", getPlanById);
route.post(
  "/generate-program",
  validateSchema(generateProgramSchema),
  generateProgram,
);

module.exports = route;
