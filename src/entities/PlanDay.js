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
    title: {
      type: "varchar",
      length: 100,
      comment: "Push / Pull / Legs / Full Body",
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
    workoutPlan: {
      type: "many-to-one",
      target: "WorkoutPlan",
      joinColumn: {
        name: "workout_plan_id",
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
