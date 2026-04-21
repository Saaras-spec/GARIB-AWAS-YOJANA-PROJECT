const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/signup — Officer registration
router.post('/signup', authController.signup);

// POST /api/auth/login — Common login (Officer + User)
router.post('/login', authController.login);

module.exports = router;
