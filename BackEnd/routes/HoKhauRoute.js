const express = require('express');
const router = express.Router();
const HoKhauController = require('../controllers/HoKhauController.js');

// Lấy tất cả hộ khẩu:
router.get('/', HoKhauController.getAll);
// Lấy thông tin hộ khẩu dựa trên id:
router.get('/:id', HoKhauController.getId);
// Thêm hộ khẩu mới:
router.post('/', HoKhauController.create);
// Cập nhật thông tin hộ khẩu:
router.put('/:id', HoKhauController.update);
// Xóa hộ khẩu:
router.delete('/:id', HoKhauController.delete);

module.exports = router;