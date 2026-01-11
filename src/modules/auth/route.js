const router = require("express").Router();
const controller = require("./controller");
const { authorize } = require("./middlewares");

router.use("/register", controller.register);
router.use("/login", controller.login);
router.get("/profile", authorize(), controller.profile);

module.exports = router;
