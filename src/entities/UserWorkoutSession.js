const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "WorkoutSession",
  tableName: "workout_sessions",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    seconds: {
      type: "int",
      nullable: true,
    },
    startedAt: {
      nullable: true,
      type: "timestamp",
    },
    finishedAt: {
      type: "timestamp",
      nullable: true,
    },
  },
  relations: {
    userWorkoutPlan: {
      type: "many-to-one",
      target: "UserWorkoutPlan",
      joinColumn: {
        name: "user_plan_id",
      },
      onDelete: "CASCADE",
    },
    userWorkoutDay: {
      type: "many-to-one",
      target: "UserWorkoutDay",
      joinColumn: {
        name: "user_day_id",
      },
      onDelete: "CASCADE",
    },
    exercises: {
      target: "WorkoutSessionExercise",
      type: "one-to-many",
      inverseSide: "workoutSession",
      cascade: true,
    },
  },
});
