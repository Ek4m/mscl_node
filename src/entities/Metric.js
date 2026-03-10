const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Metric",
  tableName: "metrics",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      unique: true, // e.g., "Weight", "Distance"
    },
    defaultValue: {
      type: "int",
    },
    unitSymbol: {
      type: "varchar", // e.g., "kg", "m", "s"
    },
  },
});
