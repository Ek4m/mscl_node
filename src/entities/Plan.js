const { EntitySchema } = require("typeorm");
const { GymLevel, CreationType } = require("../modules/workout/vault");

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

    thumbnail: {
      type: "varchar",
      nullable: true,
      length: 255,
    },

    creationType: {
      type: "varchar",
      nullable: true,
      length: 50,
      default: CreationType.PROFESSIONAL,
    },

    gender: {
      type: "enum",
      nullable: false,
      default: "male",
      enum: ["male", "female"],
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

    isWeeklyStatic: {
      type: "boolean",
      default: false,
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

    weeks: {
      type: "one-to-many",
      target: "WorkoutPlanWeek",
      inverseSide: "workoutPlan",
      cascade: true,
    },
  },
});
