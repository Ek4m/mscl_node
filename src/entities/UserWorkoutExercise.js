const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "UserWorkoutExercise",
  tableName: "user_workout_exercises",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    orderIndex: {
      type: "int",
      comment: "Order inside the day",
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
    userWorkoutDay: {
      type: "many-to-one",
      target: "UserWorkoutDay",
      joinColumn: {
        name: "user_workout_day_id",
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
