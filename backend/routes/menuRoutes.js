const express = require("express");
const menuController = require("../controllers/menuController");

const router = express.Router();

router.get("/", menuController.list);
router.get("/search", menuController.search);
router.post("/add", menuController.add);
router.post("/edit/:id", menuController.edit);
router.get("/delete/:id", menuController.remove);

module.exports = router;
