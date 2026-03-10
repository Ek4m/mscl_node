const ExerciseType = require("../../entities/ExerciseType");
const Metric = require("../../entities/Metric");
const Variation = require("../../entities/Variation");
const { getRepo } = require("../auth/helpers");
const { SuccessResponse } = require("./helpers");

const getLists = async (req, res) => {
  const exRepo = getRepo(Variation);
  const exTypeRepo = getRepo(ExerciseType);
  const metricRepo = getRepo(Metric);
  const exercises = await exRepo.find({
    relations: {
      exercise: {
        defaultMetric: true,
      },
    },
  });
  const exerciseTypes = await exTypeRepo.find();
  const metrics = await metricRepo.find();
  SuccessResponse(res, { exercises, exerciseTypes, metrics });
};

module.exports = {
  getLists,
};
