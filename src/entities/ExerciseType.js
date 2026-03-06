const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "TrainingType",
  tableName: "exercise_types",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
      unique: true,
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
    exerciseGroups: {
      type: "one-to-many",
      target: "Exercise",
      inverseSide: "trainingType",
    },
  },
});
