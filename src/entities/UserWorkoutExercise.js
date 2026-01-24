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

    exercise: {
      type: "many-to-one",
      target: "Exercise",
      joinColumn: {
        name: "exercise_id",
      },
      onDelete: "RESTRICT",
    },

    sets: {
      type: "one-to-many",
      target: "UserWorkoutSet",
      inverseSide: "userWorkoutExercise",
      cascade: true,
    },
  },
});
