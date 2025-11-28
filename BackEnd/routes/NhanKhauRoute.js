const express = require('express');
const router = express.Router();
const NhanKhauController = require('../controllers/NhanKhauController.js');

// Lấy tất cả hộ khẩu:
router.get('/', NhanKhauController.getAll);
// Lấy thông tin hộ khẩu dựa trên id:
router.get('/:id', NhanKhauController.getId);
// Thêm hộ khẩu mới:
router.post('/', NhanKhauController.create);
// Cập nhật thông tin hộ khẩu:
router.put('/:id', NhanKhauController.update);
// Xóa hộ khẩu:
router.delete('/:id', NhanKhauController.delete);

module.exports = router;