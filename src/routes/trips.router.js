const express = require('express');
const router = express.Router();
const { protect, authorize } = require('@/middleware/auth');
const {
  getTrips,
  getMyTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
} = require('@/controllers/trips.controller');

// @desc    Get all trips (with filters)
// @route   GET /api/trips
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), getTrips);

// @desc    Get my trips
// @route   GET /api/trips/my-trips
// @access  Private
router.get('/my-trips', protect, getMyTrips);

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
router.get('/:id', protect, getTrip);

// @desc    Create new trip
// @route   POST /api/trips
// @access  Private (Driver/Attender)
router.post('/', protect, createTrip);

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
router.put('/:id', protect, updateTrip);

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
router.delete('/:id', protect, deleteTrip);

module.exports = router;
