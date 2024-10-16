// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { protect, isHR } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for registering a new user
router.post('/register', registerUser);

// Route for logging in a user
router.post('/login', loginUser);

// Route for logging out a user
router.post('/logout', protect, logoutUser);

module.exports = router;
