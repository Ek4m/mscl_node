const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "UserWorkoutWeek",
  tableName: "user_workout_weeks",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    weekIndex: {
      type: "int",
      comment: "0-based index of the week in the user's plan",
    },
    title: {
      type: "varchar",
      length: 100,
      nullable: true,
      comment: "e.g., 'Intro Week' or 'Deload Week'",
    },
    isCompleted: {
      type: "boolean",
      default: false,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },

  relations: {
    userWorkoutPlan: {
      type: "many-to-one",
      target: "UserWorkoutPlan",
      joinColumn: {
        name: "user_workout_plan_id",
      },
      onDelete: "CASCADE",
    },
    days: {
      type: "one-to-many",
      target: "UserWorkoutDay",
      inverseSide: "userWorkoutWeek",
      cascade: true,
    },
  },
});