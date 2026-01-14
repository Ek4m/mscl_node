const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const AppDataSource = require("../db/init");
const authRoute = require("./modules/auth/route");
const workoutRoute = require("./modules/workout/route");

const { errorHandler, logger } = require("./modules/common/middleware");
const { authorize } = require("./modules/auth/middlewares");

const app = express();
app.use(logger);
app.use(express.json());

app.use("/auth", authRoute);
app.use("/workout", authorize(),workoutRoute);
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(error));
