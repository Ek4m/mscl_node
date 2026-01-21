const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Exercise",
  tableName: "exercises",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
      length: 255,
    },
    steps: {
      type: "simple-array",
      nullable: true,
    },
    description: {
      type: "text",
      nullable: true,
    },
    primaryMuscles: {
      type: "simple-array",
    },
    secondaryMuscles: {
      type: "simple-array",
      nullable: true,
    },
    slug: {
      type: "varchar",
      nullable: true,
    },
    equipment: {
      type: "varchar",
      default: "none",
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
});
