const { SuccessResponse, ErrorResponse } = require("../common/helpers");
const { detectObjects } = require("../predictions/helpers");

const getPredictions = async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    ErrorResponse(res, "No images provided", 400);
  } else {
    try {
      const response = await detectObjects(files);
      SuccessResponse(res, response);
    } catch (error) {
      console.error("Error during image classification:", error);
      ErrorResponse(res, "Internal Server Error");
    }
  }
};

module.exports = {
  getPredictions,
};
