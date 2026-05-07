const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// @route POST /api/auth/signup
// @desc  Register user
router.post('/signup', authController.signup);

// @route POST /api/auth/login
// @desc  Login user and get token
router.post('/login', authController.login);

// @route   GET /api/auth/me
// @desc    Get logged in user
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
