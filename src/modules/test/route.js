const { uploadGet, uploadPost, loadToExercises } = require("./controller");
const uploader = require("../../config/multer/init");

const router = require("express").Router();

router.get("/upload", uploadGet);
router.get("/load",loadToExercises)
router.post("/upload", uploader.single("file"), uploadPost);

module.exports = router;
