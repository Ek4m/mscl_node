const { getLists } = require("./controller");

const route = require("express").Router();

route.get("/exercises-and-equipments", getLists);

module.exports = route;
