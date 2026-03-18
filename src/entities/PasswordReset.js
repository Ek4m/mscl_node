const { EntitySchema } = require("typeorm");

const PasswordReset = new EntitySchema({
  name: "PasswordReset",
  tableName: "password_resets",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    token: {
      type: "varchar",
      unique: true,
    },

    expiresAt: {
      type: "timestamp",
    },

    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },

  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "userId",
      },
      onDelete: "CASCADE",
    },
  },
});

module.exports = PasswordReset;
