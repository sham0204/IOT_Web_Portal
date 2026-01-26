const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser, updateUserProfile } = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get current user profile (protected route)
router.get('/profile', authenticateToken, getCurrentUser);

// Update user profile (protected route)
router.put('/profile', authenticateToken, updateUserProfile);

module.exports = router;