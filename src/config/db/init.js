const { DataSource } = require("typeorm");
const User = require("../../entities/User");
const WorkoutDay = require("../../entities/WorkoutDay");
const WorkoutMove = require("../../entities/WorkoutMove");
const Program = require("../../entities/Program");

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "muscle_app",
  synchronize: true,
  entities: [User, WorkoutDay, WorkoutMove, Program],
});
module.exports = AppDataSource;
