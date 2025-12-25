const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/PhuongTienController");

router.get("/", ctrl.getAll);
router.post("/", ctrl.create);
router.delete("/:id", ctrl.delete);

module.exports = router;
