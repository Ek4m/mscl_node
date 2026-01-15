const Program = require("../../../entities/Program");
const { dummyProgram, dummyEquipments } = require("./data");

const { SuccessResponse, ErrorResponse } = require("../common/helpers");
const { getRepo } = require("../auth/helpers");
const { isDev } = require("../../helpers");
const { detectObjects, generateWorkoutProgram } = require("./helpers");

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
  try {
    const response = isDev
      ? dummyProgram
      : await generateWorkoutProgram(equipments, level, numOfDays);
    const newProgram = await getRepo(Program).save({
      ...response,
      userId: req.user.id,
    });
    SuccessResponse(res, newProgram);
  } catch (error) {
    console.error("Error during image classification:", error);
    ErrorResponse(res, "Internal Server Error");
  }
};

module.exports = {
  getEquipments,
  generateProgram,
};
