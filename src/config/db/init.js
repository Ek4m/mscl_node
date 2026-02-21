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
const UserWorkoutSet = require("../../entities/UserWorkoutSet");
const Variation = require("../../entities/Variation");

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
    Equipment,
    ExerciseEquipment,
    Variation,
    Plan,
    PlanDay,
    PlanWeek,
    PlanDayExercise,
    UserWorkoutExercise,
    UserWorkoutDay,
    UserWorkoutPlan,
    UserWorkoutWeek,
    UserWorkoutSet,
  ],
});
module.exports = AppDataSource;
