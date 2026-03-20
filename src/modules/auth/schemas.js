const { z } = require("zod");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /^(?=.*[^a-zA-Z0-9])/,
    "Password must contain at least one special character",
  );

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  password: passwordSchema,
});

const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters"),
  password: passwordSchema,
});

const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .length(6, { error: "Token must have 6 characters" })
      .nonempty("Token is required"),
    newPassword: passwordSchema,
    newPasswordRetyped: passwordSchema,
  })
  .refine((data) => data.newPassword === data.newPasswordRetyped, {
    path: ["newPasswordRetyped"],
    message: "Passwords do not match",
  });

const changePasswordSchema = z
  .object({
    password: passwordSchema,
    newPassword: passwordSchema,
    newPasswordRetyped: passwordSchema,
  })
  .refine((data) => data.newPassword === data.newPasswordRetyped, {
    message: "Passwords do not match",
    path: ["newPasswordRetyped"], // This targets the error specifically to the retyped field
  })
  .refine((data) => data.password !== data.newPassword, {
    message: "New password cannot be the same as the current password",
    path: ["newPassword"],
  });

module.exports = { registerSchema, loginSchema, resetPasswordSchema, changePasswordSchema };
