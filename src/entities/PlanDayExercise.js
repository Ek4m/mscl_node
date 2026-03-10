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
    },
    targetSets: {
      type: "int",
      nullable: true,
    },

    targetReps: {
      type: "int",
      nullable: true,
    },

    targetValue: {
      type: "float",
      nullable: true,
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
      onDelete: "RESTRICT",
    },

    metric: {
      type: "many-to-one",
      target: "Metric",
      joinColumn: { name: "metric_id" },
      nullable: true,
      onDelete: "RESTRICT",
    },
  },
});
