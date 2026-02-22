const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "UserWorkoutDay",
  tableName: "user_workout_days",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    dayIndex: {
      type: "int",
      comment: "Order of the day in the plan",
    },

    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },

  relations: {
    userWorkoutWeek: {
      type: "many-to-one",
      target: "UserWorkoutWeek",
      joinColumn: {
        name: "user_workout_week_id",
      },
      onDelete: "CASCADE",
    },

    exercises: {
      type: "one-to-many",
      target: "UserWorkoutExercise",
      inverseSide: "userWorkoutDay",
      cascade: true,
    },
  },
});
