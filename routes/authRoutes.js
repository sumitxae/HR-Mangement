// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { protect, isHR } = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user (HR or Employee)
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', loginUser);

// @route   POST /api/auth/logout
// @desc    Logout user
router.post('/logout', protect, logoutUser);

module.exports = router;
