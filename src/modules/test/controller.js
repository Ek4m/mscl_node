const storage = require("../../config/storage");
const { MuscleGroups } = require("../workout/vault");
const { getRepo } = require("../auth/helpers");
const Exercise = require("../../entities/Exercise");
const { SuccessResponse } = require("../common/helpers");

const loadToExercises = async (req, res) => {
  const EXERCISES_SEED = [];
  const arr = [];
  for (let e of EXERCISES_SEED) {
    const repo = getRepo(Exercise);
    let ex = await repo.findOne({
      where: { slug: e.slug },
    });
    if (!ex) {
      ex = await repo.save(e);
    }
    console.log(ex);
    arr.push(ex);
  }
  SuccessResponse(res, arr);
};

const uploadGet = (_, res) => {
  res.render("upload");
};

const uploadPost = (req, res) => {
  const file = req.file;
  const stream = storage.uploader.upload_stream({
    public_id: req.body.slug,
    resource_type: "image",
    overwrite: true,
  });
  stream.end(file.buffer);
  res.redirect("/test/upload");
};

module.exports = {
  uploadGet,
  uploadPost,
  loadToExercises,
};
