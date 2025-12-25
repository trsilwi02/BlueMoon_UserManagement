const express = require('express');
const router = express.Router();

const CongNoController = require('../controllers/CongNoController');

router.get('/summary', CongNoController.getSummary);

router.get('/', CongNoController.getAll);
router.get('/:id', CongNoController.getId);
router.post('/', CongNoController.create);
router.put('/:id', CongNoController.update);
router.delete('/:id', CongNoController.delete);

module.exports = router;
