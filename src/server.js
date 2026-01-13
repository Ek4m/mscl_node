const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const AppDataSource = require("../db/init");
const authRoute = require("./modules/auth/route");
const predictionRoute = require("./modules/predictions/route");

const { errorHandler, logger } = require("./modules/common/middleware");

const app = express();
app.use(logger);
app.use(express.json());

app.use("/auth", authRoute);
app.use("/predictions", predictionRoute);

app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(error));
