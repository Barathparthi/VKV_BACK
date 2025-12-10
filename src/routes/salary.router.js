const express = require('express');
const router = express.Router();
const { protect, authorize } = require('@/middleware/auth');
const {
  getSalaries,
  getSalary,
  getMySalary,
  calculateMonthlySalary,
  createOrUpdateSalaryManually,
  updateSalary,
  approveSalary,
  markSalaryAsPaid,
} = require('@/controllers/salary.controller');

// @desc    Get all salaries
// @route   GET /api/salary
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), getSalaries);

// @desc    Get my salary history
// @route   GET /api/salary/my-salary
// @access  Private
router.get('/my-salary', protect, getMySalary);

// @desc    Get salary by ID
// @route   GET /api/salary/:id
// @access  Private
router.get('/:id', protect, getSalary);

// @desc    Calculate monthly salary
// @route   POST /api/salary/calculate-monthly
// @access  Private (Admin)
router.post('/calculate-monthly', protect, authorize('admin'), calculateMonthlySalary);

// @desc    Create/Update salary manually
// @route   POST /api/salary
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), createOrUpdateSalaryManually);

// @desc    Update salary
// @route   PUT /api/salary/:id
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), updateSalary);

// @desc    Approve salary
// @route   PUT /api/salary/:id/approve
// @access  Private (Admin)
router.put('/:id/approve', protect, authorize('admin'), approveSalary);

// @desc    Mark salary as paid
// @route   PUT /api/salary/:id/paid
// @access  Private (Admin)
router.put('/:id/paid', protect, authorize('admin'), markSalaryAsPaid);

module.exports = router;
