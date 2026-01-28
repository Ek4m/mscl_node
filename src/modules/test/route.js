const { uploadGet, uploadPost, loadToExercises, getPlan } = require("./controller");
const uploader = require("../../config/multer/init");

const router = require("express").Router();

router.get("/upload", uploadGet);
router.get("/load",loadToExercises)
router.get("/get-plan",getPlan)
router.post("/upload", uploader.single("file"), uploadPost);

module.exports = router;
