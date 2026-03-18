const router = require("express").Router();
const {
  login,
  profile,
  register,
  freeze,
  forgotPassword,
  resetPassword,
} = require("./controller");
const { authorize, validateSchema } = require("./middlewares");
const {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} = require("./schemas");

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.delete("/freeze", authorize(), freeze);
router.post("/forgot-password", forgotPassword);
router.post(
  "/reset-password",
  validateSchema(resetPasswordSchema),
  resetPassword,
);
router.get("/profile", authorize(), profile);

module.exports = router;
