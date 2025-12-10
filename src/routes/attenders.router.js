const express = require('express');
const router = express.Router();
const { protect, authorize } = require('@/middleware/auth');
const {
  getAttenders,
  getAttender,
  createAttender,
  updateAttender,
  deleteAttender,
} = require('@/controllers/attenders.controller');

// @desc    Get all attenders
// @route   GET /api/attenders
// @access  Public
router.get('/', getAttenders);

// @desc    Get attender by ID
// @route   GET /api/attenders/:id
// @access  Private
router.get('/:id', protect, getAttender);

// @desc    Create new attender
// @route   POST /api/attenders
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), createAttender);

// @desc    Update attender
// @route   PUT /api/attenders/:id
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), updateAttender);

// @desc    Delete attender (soft delete)
// @route   DELETE /api/attenders/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), deleteAttender);

module.exports = router;
