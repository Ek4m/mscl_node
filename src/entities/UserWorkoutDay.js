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

    title: {
      type: "varchar",
      length: 100,
      nullable: true,
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

    exercises: {
      type: "one-to-many",
      target: "UserWorkoutExercise",
      inverseSide: "userWorkoutDay",
      cascade: true,
    },
  },
});
