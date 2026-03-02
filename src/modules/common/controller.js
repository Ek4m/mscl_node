const Exercise = require("../../entities/Exercise");
const { getRepo } = require("../auth/helpers");
const { flattenExercises } = require("../workout/helpers");
const { SuccessResponse } = require("./helpers");

const getLists = async (req, res) => {
  const exRepo = getRepo(Exercise);
  const exercises = await exRepo.find({
    relations: {
      variations: true,
    },
  });
  const resultExercises = flattenExercises(exercises);
  SuccessResponse(res, { exercises: resultExercises });
};

module.exports = {
  getLists,
};
