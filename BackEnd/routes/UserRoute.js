const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController.js');

router.post('/login', LoginController.login);

module.exports = router;
