const { EntitySchema } = require("typeorm");
const { GymLevel } = require("../modules/workout/vault");

module.exports = new EntitySchema({
  name: "Variation",
  tableName: "variations",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
      length: 255,
      nullable: true, // e.g., "Barbell Version" or "Dumbbell Version"
    },
    description: {
      type: "text",
      nullable: true,
    },
    level: {
      type: "varchar",
      nullable: true,
      default: GymLevel.BEGINNER,
    },
  },
  relations: {
    exercise: {
      type: "many-to-one",
      target: "Exercise",
      joinColumn: { name: "exercise_id" },
      onDelete: "CASCADE",
    },
    // This allows one variation to require multiple pieces of equipment
    equipment: {
      type: "many-to-many",
      target: "Equipment",
      joinTable: {
        name: "variation_equipment", // This is your variation_equipment table
        joinColumn: {
          name: "variation_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "equipment_id",
          referencedColumnName: "id",
        },
      },
    },
  },
});
