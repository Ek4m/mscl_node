const Equipment = require("../../entities/Equipment");
const Exercise = require("../../entities/Exercise");
const { getRepo } = require("../auth/helpers");
const { SuccessResponse } = require("./helpers");

const getLists = async (req, res) => {
  const exRepo = getRepo(Exercise);
  const equipmentRepo = getRepo(Equipment);
  const exercises = await exRepo.find();
  const equipments = await equipmentRepo.find();
  SuccessResponse(res, { exercises, equipments });
};

module.exports = {
  getLists,
};
