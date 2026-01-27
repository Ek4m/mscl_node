const { dummyProgram, dummyEquipments } = require("./data");

const { SuccessResponse, ErrorResponse } = require("../common/helpers");
const { getRepo } = require("../auth/helpers");
const { isDev } = require("../../helpers");
const {
  detectObjects,
  generateWorkoutProgram,
  transformToWorkoutPlan,
} = require("./helpers");

const Plan = require("../../entities/Plan");
const Equipment = require("../../entities/Equipment");
const Exercise = require("../../entities/Exercise");

const getEquipments = async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    ErrorResponse(res, "No images provided", 400);
  } else {
    try {
      const response = isDev ? dummyEquipments : await detectObjects(files);
      SuccessResponse(res, response);
    } catch (error) {
      console.error("Error during image classification:", error);
      ErrorResponse(res, "Internal Server Error");
    }
  }
};
const generateProgram = async (req, res) => {
  const { equipments, numOfDays, level } = req.body;
  const response = isDev
    ? dummyProgram
    : await generateWorkoutProgram(equipments, level, numOfDays);
  const newProgram = await getRepo(Program).save({
    ...response,
    userId: req.user.id,
  });
  SuccessResponse(res, newProgram);
};

const getUsersPlans = async (req, res) => {
  const plans = await getRepo(Plan).find({
    relations: {
      days: true,
    },
  });
  SuccessResponse(res, plans);
};

const getPlanById = async (req, res) => {
  const { id } = req.params;
  if (!id) ErrorResponse(res, "No parameter provided");
  SuccessResponse(res, []);
};

const getLists = async (req, res) => {
  const exRepo = getRepo(Exercise);
  const equipmentRepo = getRepo(Equipment);
  const exercises = await exRepo.find();
  const equipments = await equipmentRepo.find();
  SuccessResponse(res, { exercises, equipments });
};

const createPlan = async (req, res) => {
  const { plan, title } = req.body;
  if (!plan || !Array.isArray(plan) || !plan.length)
    ErrorResponse(res, "Provided plan credentials are not valid. Check again");
  const planRepo = getRepo(Plan);
  const mappedBody = transformToWorkoutPlan({ plan, title }, req.user.id);
  const newPlan = await planRepo.save(mappedBody);
  SuccessResponse(res, newPlan);
};

module.exports = {
  getEquipments,
  generateProgram,
  getUsersPlans,
  getPlanById,
  getLists,
  createPlan,
};
