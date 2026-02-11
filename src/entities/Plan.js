const { EntitySchema } = require("typeorm");
const { GymLevel } = require("../modules/workout/vault");

module.exports = new EntitySchema({
  name: "WorkoutPlan",
  tableName: "workout_plans",

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

    level: {
      nullable: false,
      type: "varchar",
      default: GymLevel.BEGINNER,
    },

    description: {
      type: "text",
      nullable: true,
    },

    daysPerWeek: {
      type: "int",
      default: 1,
    },

    isTemplate: {
      type: "boolean",
      default: true,
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
    createdBy: {
      type: "many-to-one",
      target: "User",
      nullable: true,
      joinColumn: {
        name: "created_by_user_id",
      },
      onDelete: "SET NULL",
    },

    // Days inside this plan
    days: {
      type: "one-to-many",
      target: "WorkoutPlanDay",
      inverseSide: "workoutPlan",
      cascade: true,
    },
  },
});
