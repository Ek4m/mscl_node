const Variation = require("../../entities/Variation");
const { getRepo } = require("../auth/helpers");
const { SuccessResponse } = require("./helpers");

const getLists = async (req, res) => {
  const exRepo = getRepo(Variation);
  const exercises = await exRepo.find();
  SuccessResponse(res, { exercises });
};

module.exports = {
  getLists,
};
