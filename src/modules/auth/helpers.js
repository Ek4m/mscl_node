const AppDataSource = require("../../../db/init");

const getRepo = (entity) => {
  return AppDataSource.getRepository(entity);
};

module.exports = {
  getRepo,
};
