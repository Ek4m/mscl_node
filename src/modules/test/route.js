const { uploadGet, uploadPost } = require("./controller");
const uploader = require("../../config/multer/init");

const router = require("express").Router();

router.get("/upload", uploadGet);
router.post("/upload", uploader.single("file"), uploadPost);

module.exports = router;
