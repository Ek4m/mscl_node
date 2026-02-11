const Equipment = require("../../entities/Equipment");
const Exercise = require("../../entities/Exercise");
const { getRepo } = require("../auth/helpers");
const { flattenExercises } = require("../workout/helpers");
const { SuccessResponse } = require("./helpers");

const getLists = async (req, res) => {
  const exRepo = getRepo(Exercise);
  const equipmentRepo = getRepo(Equipment);
  const exercises = await exRepo.find({
    relations: {
      variations: true,
    },
  });
  const equipments = await equipmentRepo.find();
  SuccessResponse(res, { exercises: flattenExercises(exercises), equipments });
};

module.exports = {
  getLists,
};
