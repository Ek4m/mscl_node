const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "WorkoutPlanDay",
  tableName: "workout_plan_days",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    dayIndex: {
      type: "int",
      default: 0,
    },
    description: {
      type: "text",
      nullable: true,
    },

    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },

  relations: {
    workoutWeek: {
      type: "many-to-one",
      target: "WorkoutPlanWeek",
      joinColumn: {
        name: "workout_plan_week_id",
      },
      onDelete: "CASCADE",
    },
    exercises: {
      type: "one-to-many",
      target: "WorkoutPlanDayExercise",
      inverseSide: "workoutPlanDay",
      cascade: true,
    },
  },
});
