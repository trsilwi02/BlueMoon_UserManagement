const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');
const LoginController = require('../controllers/LoginController');

// API đăng ký
router.post('/register', UserController.register);

// API đăng nhập
router.post('/login', LoginController.login);

module.exports = router;   
