const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Program",
  tableName: "programs",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
    },
    level: {
      type: "varchar",
    },
    userId: {
      name: "user_id",
      type: "int",
    },
  },
  relations: {
    days: {
      target: "WorkoutDay",
      type: "one-to-many",
      inverseSide: "program",
      cascade: true,
    },
  },
});
