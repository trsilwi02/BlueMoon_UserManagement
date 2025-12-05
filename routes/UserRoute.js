const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController.js');

// Lấy tất cả user:
router.get('/', UserController.getAll);
// Lấy thông tin user dựa trên id:
router.get('/:id', UserController.getId);
// Thêm user mới:
router.post('/', UserController.create);
// Cập nhật thông tin user:
router.put('/:id', UserController.update);
// Xóa user:
router.delete('/:id', UserController.delete);

module.exports = router;
