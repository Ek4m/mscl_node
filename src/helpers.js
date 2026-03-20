const AppDataSource = require("./config/db/init");

const isDev = process.env.NODE_ENV.trim() === "dev";

console.log("IS DEVELOPMENT? ", isDev);

const handleTransaction = (handler) => {
  return async (req, res, next) => {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await handler(req, res, next, queryRunner.manager);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      next(err);
    } finally {
      await queryRunner.release();
    }
  };
};
module.exports = {
  isDev,
  handleTransaction,
};
