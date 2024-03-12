
const express = require('express');
const router = express.Router();
const { register, login } = require('../controller/auth52Controller');

// User registration route
router.post('/register', register);

// User authentication route
router.post('/login', login);

module.exports = router;
