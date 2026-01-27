const route = require("express").Router();
const uploader = require("../../config/multer/init");

const {
  getEquipments,
  generateProgram,
  getUsersPlans,
  getPlanById,
  getLists,
  createPlan,
} = require("./controller");
const { validateSchema } = require("../auth/middlewares");
const { generateProgramSchema, workoutPlanSchema } = require("./schemas");

route.post("/detect", uploader.array("images", 6), getEquipments);
route.post(
  "/generate-program",
  validateSchema(generateProgramSchema),
  generateProgram,
);
route.post("/plan/custom-create", validateSchema(workoutPlanSchema), createPlan);

route.get("/plans", getUsersPlans);
route.get("/plans/:id", getPlanById);

route.get("/data/all", getLists);

module.exports = route;
