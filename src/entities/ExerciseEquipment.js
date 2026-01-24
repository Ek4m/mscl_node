const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "ExerciseEquipment",
  tableName: "exercise_equipment",
  columns: {
    exerciseId: {
      type: "int",
      primary: true,
    },
    equipmentId: {
      type: "int",
      primary: true,
    },
  },
});
