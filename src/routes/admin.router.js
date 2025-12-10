const express = require('express');
const router = express.Router();
const { protect, authorize } = require('@/middleware/auth');
const {
  getDashboardStats,
  getTrips,
  approveOrRejectTrip,
  getUsers,
  getDrivers,
  getAttenders,
} = require('@/controllers/admin.controller');

const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  resetUserPassword
} = require('@/controllers/userManagement.controller');

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard/stats
router.get('/dashboard/stats', getDashboardStats);

// @desc    Get all trips (Admin)
// @route   GET /api/admin/trips
router.get('/trips', getTrips);

// @desc    Approve/Reject trip
// @route   PUT /api/admin/trips/:id/:action
router.put('/trips/:id/:action', approveOrRejectTrip);

// @desc    Get all users
// @route   GET /api/admin/users
router.get('/users', getUsers);

// @desc    Get all drivers
// @route   GET /api/admin/drivers
router.get('/drivers', getDrivers);

// @desc    Get all attenders
// @route   GET /api/admin/attenders
router.get('/attenders', getAttenders);

// User Management Routes
// @desc    Get all users (drivers and attenders)
// @route   GET /api/admin/user-management
router.get('/user-management', getAllUsers);

// @desc    Create new user (driver or attender)
// @route   POST /api/admin/user-management
router.post('/user-management', createUser);

// @desc    Update user
// @route   PUT /api/admin/user-management/:id
router.put('/user-management/:id', updateUser);

// @desc    Delete user
// @route   DELETE /api/admin/user-management/:id
router.delete('/user-management/:id', deleteUser);

// @desc    Reset user password
// @route   PUT /api/admin/user-management/:id/password
router.put('/user-management/:id/password', resetUserPassword);

module.exports = router;
