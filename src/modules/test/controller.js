const { SuccessResponse } = require("../common/helpers");
const storage = require("../../config/storage");

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
  SuccessResponse(res, { message: "SAAA" });
};

module.exports = {
  uploadGet,
  uploadPost,
};
