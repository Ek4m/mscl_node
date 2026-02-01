const router = require("express").Router();
const { login, profile, register, freeze } = require("./controller");
const { authorize, validateSchema } = require("./middlewares");
const { loginSchema, registerSchema } = require("./schemas");

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.delete("/freeze", authorize(), freeze);
router.get("/profile", authorize(), profile);

module.exports = router;
