const express = require('express');
const router = express.Router();
const CongNoController = require('../controllers/CongNoController.js');

// Lấy tất cả công nợ:
router.get('/', CongNoController.getAll);
// Lấy thông tin công nợ dựa trên id:
router.get('/:id', CongNoController.getId);
// Thêm công nợ mới:
router.post('/', CongNoController.create);
// Cập nhật thông tin công nợ:
router.put('/:id', CongNoController.update);
// Xóa công nợ:
router.delete('/:id', CongNoController.delete);

module.exports = router;