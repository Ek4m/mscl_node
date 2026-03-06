const { getLists } = require("./controller");

const route = require("express").Router();

route.get("/metadata", getLists);

module.exports = route;
