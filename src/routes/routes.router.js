const express = require('express');
const router = express.Router();
const { protect } = require('@/middleware/auth');
const {
  getRoutePrice,
  getRoutes,
  getLocations,
  getRoute,
  findRoute,
  createRoute,
  updateRoutePrice,
  updateRoute,
  deleteRoute,
} = require('@/controllers/routes.controller');

// Get route price
router.get('/price/:from/:to', protect, getRoutePrice);

// Get all routes
router.get('/', protect, getRoutes);

// Get all unique locations (for dropdowns)
router.get('/locations', protect, getLocations);

// Find route by from and to locations
router.get('/find/:from/:to', protect, findRoute);

// Get route by ID
router.get('/:id', protect, getRoute);

// Create new route (admin only)
router.post('/', protect, createRoute);

// Update or Create route price (admin only)
router.post('/price', protect, updateRoutePrice);

// Update route (admin only)
router.put('/:id', protect, updateRoute);

// Delete route (admin only) - soft delete
router.delete('/:id', protect, deleteRoute);

module.exports = router;
