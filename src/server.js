const express = require("express");
const AppDataSource = require("../db/init");
const authRoute = require("./modules/auth/route");
const { errorHandler } = require("./modules/common/middleware");

const app = express();
app.use(express.json());

app.use("/auth", authRoute);

app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((error) => console.log(error));
