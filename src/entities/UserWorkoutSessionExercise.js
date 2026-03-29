const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "WorkoutSessionExercise",
  tableName: "workout_session_exercises",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    reps: {
      type: "int",
      nullable: true,
    },
    orderIndex: {
      type: "int",
    },
    doneValue: {
      type: "int",
    },
    workoutExerciseId: {
      name: "user_workout_exercise_id",
    },
    extraWeight: {
      type: "int",
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    workoutSession: {
      type: "many-to-one",
      target: "WorkoutSession",
      joinColumn: { name: "workout_session_id" },
      onDelete: "CASCADE",
    },
    userWorkoutExercise: {
      type: "many-to-one",
      target: "UserWorkoutExercise",
      joinColumn: { name: "user_workout_exercise_id" },
      onDelete: "CASCADE",
    },
    variation: {
      type: "many-to-one",
      target: "Variation",
      joinColumn: { name: "variation_id" },
      onDelete: "RESTRICT",
    },
  },
});
