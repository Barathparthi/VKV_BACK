const express = require('express');
const router = express.Router();
const { protect, authorize } = require('@/middleware/auth');
const {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('@/controllers/vehicles.controller');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private
router.get('/', protect, getVehicles);

// @desc    Create vehicle
// @route   POST /api/vehicles
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), createVehicle);

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), updateVehicle);

// @desc    Delete vehicle (Soft delete)
// @route   DELETE /api/vehicles/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), deleteVehicle);

module.exports = router;
