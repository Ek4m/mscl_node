const AppDataSource = require("../../config/db/init");

const getRepo = (entity) => {
  return AppDataSource.getRepository(entity);
};

module.exports = {
  getRepo,
};
