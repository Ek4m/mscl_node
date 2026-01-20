const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "WorkoutMove",
  tableName: "workout_moves",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    sets: {
      type: "int",
    },
    reps: {
      type: "varchar",
    },
  },
  relations: {
    day: {
      target: "WorkoutDay",
      type: "many-to-one",
      joinColumn: { name: "day_id" },
      onDelete: "CASCADE",
    },
  },
});
