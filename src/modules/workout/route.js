const route = require("express").Router();
const uploader = require("../../config/multer/init");

const {
  getEquipments,
  generateProgram,
  getUsersPlans,
  getPlanById,
  getPremadePlans,
  createPlan,
  getPlanRegistration,
  createPlanFromTemplate,
  updateUserPlanStatus,
} = require("./controller");
const { validateSchema } = require("../auth/middlewares");
const { generateProgramSchema } = require("./schemas");

route.post("/detect", uploader.array("images", 6), getEquipments);
route.post(
  "/generate-program",
  validateSchema(generateProgramSchema),
  generateProgram,
);
route.post("/plan/custom-create", createPlan);
route.post("/plan/plan-registration", createPlanFromTemplate);
route.post("/plan/update-status", updateUserPlanStatus);

route.get("/plans", getUsersPlans);
route.get("/premade-plans", getPremadePlans);
route.get("/user-plan/:id", getPlanById);
route.get("/plan-registration/:id", getPlanRegistration);

module.exports = route;
