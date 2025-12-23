const express = require('express');
const router = express.Router();
const QuyController = require('../controllers/QuyController.js');

// Lấy tất cả quỹ:
router.get('/', QuyController.getAll);
// Lấy thông tin quỹ dựa trên id:
router.get('/:id', QuyController.getId);
// Thêm quỹ mới:
router.post('/', QuyController.create);
// Cập nhật thông tin quỹ:
router.put('/:id', QuyController.update);
// Xóa quỹ:
router.delete('/:id', QuyController.delete);

module.exports = router;