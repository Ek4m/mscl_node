const { loadToExercises, getPlan, seedExercises } = require("./controller");

const router = require("express").Router();

router.get("/load", loadToExercises);
router.get("/loadex", seedExercises);
router.get("/get-plan", getPlan);

module.exports = router;
