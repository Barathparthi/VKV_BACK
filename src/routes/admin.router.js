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

module.exports = router;
