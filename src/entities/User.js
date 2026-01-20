const { EntitySchema } = require("typeorm");
const { UserRoles } = require("../modules/auth/enums");

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    email: {
      type: "varchar",
      unique: true,
    },
    password: {
      type: "varchar",
    },
    role: {
      type: "varchar",
      default: UserRoles.USER,
    },
    username: {
      type: "varchar",
      unique: true,
    },
  },
});
module.exports = User;
