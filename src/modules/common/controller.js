const ExerciseType = require("../../entities/ExerciseType");
const Variation = require("../../entities/Variation");
const { getRepo } = require("../auth/helpers");
const { SuccessResponse } = require("./helpers");

const getLists = async (req, res) => {
  const exRepo = getRepo(Variation);
  const exTypeRepo = getRepo(ExerciseType);
  const exercises = await exRepo.find();
  const exerciseTypes = await exTypeRepo.find();
  SuccessResponse(res, { exercises, exerciseTypes });
};

module.exports = {
  getLists,
};
