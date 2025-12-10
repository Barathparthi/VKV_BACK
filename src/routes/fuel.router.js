const express = require('express');
const router = express.Router();
const { protect, authorize } = require('@/middleware/auth');
const {
  addFuelEntry,
  getFuelEntries,
  getLatestReading,
  updateFuelEntry,
  deleteFuelEntry,
} = require('@/controllers/fuel.controller');

// @desc    Add fuel entry
// @route   POST /api/fuel
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), addFuelEntry);

// @desc    Get all fuel entries
// @route   GET /api/fuel
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), getFuelEntries);

// @desc    Get latest reading for vehicle
// @route   GET /api/fuel/vehicle/:vehicleId/latest
// @access  Private
router.get('/vehicle/:vehicleId/latest', protect, getLatestReading);

// @desc    Update fuel entry
// @route   PUT /api/fuel/:id
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), updateFuelEntry);

// @desc    Delete fuel entry
// @route   DELETE /api/fuel/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), deleteFuelEntry);

module.exports = router;
