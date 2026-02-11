const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "WorkoutPlanDayExercise",
  tableName: "workout_plan_day_exercises",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    orderIndex: {
      type: "int",
      comment: "Order of the exercise inside the day",
    },
    targetSets: {
      type: "int",
      nullable: true,
      comment: "Default number of sets for this exercise",
    },

    targetReps: {
      type: "int",
      nullable: true,
      comment: "Default number of reps per set",
    },

    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },

  relations: {
    workoutPlanDay: {
      type: "many-to-one",
      target: "WorkoutPlanDay",
      joinColumn: {
        name: "workout_plan_day_id",
      },
      onDelete: "CASCADE",
    },
    variation: {
      type: "many-to-one",
      target: "Variation",
      joinColumn: { name: "variation_id" },
      nullable: true,
    },
    exercise: {
      type: "many-to-one",
      target: "Exercise",
      joinColumn: {
        name: "exercise_id",
      },
      onDelete: "RESTRICT",
    },
  },
});
