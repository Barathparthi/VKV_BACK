const express = require('express');
const router = express.Router();
const { protect, authorize } = require('@/middleware/auth');
const {
  getDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
} = require('@/controllers/drivers.controller');

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Public
router.get('/', getDrivers);

// @desc    Get driver by ID
// @route   GET /api/drivers/:id
// @access  Private
router.get('/:id', protect, getDriver);

// @desc    Create new driver
// @route   POST /api/drivers
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), createDriver);

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), updateDriver);

// @desc    Delete driver (soft delete)
// @route   DELETE /api/drivers/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), deleteDriver);

module.exports = router;
