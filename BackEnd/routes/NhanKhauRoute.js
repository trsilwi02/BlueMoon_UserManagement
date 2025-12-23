const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/NhanKhauController');

router.get("/", ctrl.getAll);
router.get("/hokhau/:id", ctrl.getByHoKhau);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.delete);

module.exports = router;
