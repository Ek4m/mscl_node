const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "WorkoutPlanWeek",
  tableName: "workout_plan_weeks",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    weekNumber: {
      type: "int",
      comment: "e.g., Week 1, Week 2",
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
    days: {
      type: "one-to-many",
      target: "WorkoutPlanDay",
      inverseSide: "workoutWeek", // Updated reference
      cascade: true,
    },
  },
});
