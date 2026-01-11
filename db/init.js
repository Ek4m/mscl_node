const { DataSource } = require("typeorm");
const User = require("../entities/User");

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "muscle_app",
  synchronize: true,
  entities: [User],
});
module.exports = AppDataSource;
