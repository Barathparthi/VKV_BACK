const express = require('express');
const router = express.Router();
const { protect } = require('@/middleware/auth');
const {
  register,
  login,
  getMe,
  changePassword
} = require('@/controllers/auth.controller');

// @desc    Register user (Admin only)
// @route   POST /api/auth/register
// @access  Private/Admin
router.post('/register', protect, register);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', login);

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, getMe);

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, changePassword);

module.exports = router;
