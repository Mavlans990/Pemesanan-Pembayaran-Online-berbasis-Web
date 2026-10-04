const express = require("express");
const pesananController = require("../controllers/pesananController");

const router = express.Router();

router.get("/", pesananController.list);
// router.post("/add", pesananController.add);
// router.post("/edit/:id", pesananController.edit);
// router.get("/delete/:id", pesananController.remove);

// router.get("/search", pesananController.search);
// router.post("/status/:id", pesananController.setStatus);

module.exports = router;
