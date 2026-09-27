const express = require("express");
const mejaController = require("../controllers/mejaController");

const router = express.Router();

router.get("/", mejaController.list);
router.post("/add", mejaController.add);
// router.post("/edit/:id", mejaController.edit);
router.get("/delete/:id", mejaController.remove);

module.exports = router;
