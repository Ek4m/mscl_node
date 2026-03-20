const router = require("express").Router();
const {
  login,
  profile,
  register,
  freeze,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("./controller");
const { authorize, validateSchema } = require("./middlewares");
const {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require("./schemas");

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/forgot-password", forgotPassword);
router.post(
  "/change-password",
  authorize(),
  validateSchema(changePasswordSchema),
  changePassword,
);
router.post(
  "/reset-password",
  validateSchema(resetPasswordSchema),
  resetPassword,
);

router.delete("/freeze", authorize(), freeze);
router.get("/profile", authorize(), profile);

module.exports = router;
