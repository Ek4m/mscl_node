const { DataSource } = require("typeorm");

const User = require("../../entities/User");
const Exercise = require("../../entities/Exercise");
const Equipment = require("../../entities/Equipment");
const ExerciseEquipment = require("../../entities/ExerciseEquipment");
const Plan = require("../../entities/Plan");
const PlanWeek = require("../../entities/PlanWeek");
const PlanDay = require("../../entities/PlanDay");
const PlanDayExercise = require("../../entities/PlanDayExercise");
const UserWorkoutExercise = require("../../entities/UserWorkoutExercise");
const UserWorkoutDay = require("../../entities/UserWorkoutDay");
const UserWorkoutPlan = require("../../entities/UserWorkoutPlan");
const UserWorkoutWeek = require("../../entities/UserWorkoutWeek");
const ExerciseType = require("../../entities/ExerciseType");
const Variation = require("../../entities/Variation");
const Metric = require("../../entities/Metric");
const UserWorkoutSession = require("../../entities/UserWorkoutSession");
const UserWorkoutSessionExercise = require("../../entities/UserWorkoutSessionExercise");
const PasswordReset = require("../../entities/PasswordReset");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "salmanov99",
  database: "muscle_app",
  synchronize: true,
  entities: [
    User,
    Exercise,
    ExerciseType,
    Equipment,
    ExerciseEquipment,
    Variation,
    Plan,
    PasswordReset,
    PlanDay,
    PlanWeek,
    PlanDayExercise,
    UserWorkoutExercise,
    UserWorkoutDay,
    UserWorkoutPlan,
    UserWorkoutWeek,
    UserWorkoutSession,
    UserWorkoutSessionExercise,
    Metric,
  ],
});
module.exports = AppDataSource;
