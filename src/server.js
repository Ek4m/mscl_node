const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const AppDataSource = require("./config/db/init");

const authRoute = require("./modules/auth/route");
const workoutRoute = require("./modules/workout/route");
const testRoute = require("./modules/test/route");

const { errorHandler, logger } = require("./modules/common/middleware");
const { authorize } = require("./modules/auth/middlewares");

const app = express();
app.use(logger);
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use("/auth", authRoute);
app.use("/workout", authorize(), workoutRoute);
app.use(errorHandler);

if (process.env.NODE_ENV) {
  app.use("/test", testRoute);
}

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(error));
