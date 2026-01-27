const { z } = require("zod");

const generateProgramSchema = z.object({
  equipments: z
    .array(z.string().min(1, { message: "Equipment name cannot be empty" }))
    .nonempty({ message: "At least one equipment must be selected" }),
  level: z.string().min(1, { message: "Level is required" }),
  numOfDays: z
    .number({
      required_error: "Number of days is required",
      invalid_type_error: "Number of days must be a number",
    })
    .min(1, { message: "Number of days must be at least 1" })
    .max(7, { message: "Number of days cannot exceed 7" }),
});

const workoutPlanSchema = z.object({
  plan: z.array(
    z.object({
      dayNumber: z.number(),
      exercises: z.array(
        z.object({
          id: z.number(),
          reps: z.string().min(1, "All exercises must have reps entered"),
          sets: z.string().min(1, "All exercises must have set entered"),
        }),
      ), // Allows empty array by default
    }),
  ),
});

module.exports = {
  generateProgramSchema,
  workoutPlanSchema,
};
