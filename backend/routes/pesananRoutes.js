const express = require("express");
const pesananController = require("../controllers/pesananController");

const router = express.Router();

router.get("/", pesananController.list);
router.get("/events", pesananController.events);
router.post("/add", pesananController.add);
// router.post("/edit/:id", pesananController.edit);
router.get("/delete/:id", pesananController.remove);

router.get("/search", pesananController.search);
router.post("/status/:id", pesananController.setStatus);
router.get("/detail/:kode", pesananController.detail);

module.exports = router;
