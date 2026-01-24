const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "UserWorkoutSet",
  tableName: "user_workout_sets",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    setNumber: {
      type: "int",
      comment: "1,2,3…",
    },

    reps: {
      type: "int",
      nullable: true,
    },

    weight: {
      type: "float",
      nullable: true,
    },

    performedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },

  relations: {
    userWorkoutExercise: {
      type: "many-to-one",
      target: "UserWorkoutExercise",
      joinColumn: {
        name: "user_workout_exercise_id",
      },
      onDelete: "CASCADE",
    },
  },
});
