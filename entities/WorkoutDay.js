const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "WorkoutDay",
  tableName: "workout_days",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
    },
  },
  relations: {
    program: {
      target: "Program",
      type: "many-to-one",
      joinColumn: { name: "program_id" },
      onDelete: "CASCADE",
    },
    moves: {
      target: "WorkoutMove",
      type: "one-to-many",
      inverseSide: "day",
      cascade: true,
    },
  },
});
