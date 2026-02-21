const { EntitySchema } = require("typeorm");
const { GymLevel } = require("../modules/workout/vault");

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
    level: {
      type: "varchar",
      nullable: true,
      default: GymLevel.BEGINNER,
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
    variations: {
      type: "one-to-many",
      target: "Variation",
      inverseSide: "exercise", // Points back to the 'exercise' field in VariationSchema
      cascade: true,
    },
    equipment: {
      type: "many-to-many",
      target: "Equipment",
      joinTable: {
        name: "exercise_equipment",
        joinColumn: {
          name: "exerciseId",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "equipmentId",
          referencedColumnName: "id",
        },
      },
    },
  },
});
