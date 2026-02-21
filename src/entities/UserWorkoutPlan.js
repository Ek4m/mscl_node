const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "UserWorkoutPlan",
  tableName: "user_workout_plans",

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

    createdAt: {
      type: "timestamp",
      createDate: true,
    },

    isActive: {
      type: "boolean",
      default: false,
    },

    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },

  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
      },
      onDelete: "CASCADE",
    },

    weeks: {
      type: "one-to-many",
      target: "UserWorkoutWeek",
      inverseSide: "userWorkoutPlan",
      cascade: true,
    },

    // Optional: link to template
    template: {
      type: "many-to-one",
      target: "WorkoutPlan",
      nullable: true,
      joinColumn: {
        name: "template_id",
      },
      onDelete: "SET NULL",
    },
  },
});
