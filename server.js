// backend/server.js
// Register module aliases first
require('module-alias/register');

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// const db = require('./config/db');
const authRoutes = require('@/routes/auth.router');
const tripRoutes = require('@/routes/trips.router');
const salaryRoutes = require('@/routes/salary.router');
const driverRoutes = require('@/routes/drivers.router');
const attenderRoutes = require('@/routes/attenders.router');
const fuelRoutes = require('@/routes/fuel.router');
const vehicleRoutes = require('@/routes/vehicles.router');
const adminRoutes = require('@/routes/admin.router');
const routeRoutes = require('@/routes/routes.router');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/trips', tripRoutes);
// app.use('/api/salary', salaryRoutes);
// app.use('/api/drivers', driverRoutes);
// app.use('/api/attenders', attenderRoutes);
// app.use('/api/fuel', fuelRoutes);
// app.use('/api/vehicles', vehicleRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/routes', routeRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/attenders', attenderRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/routes', routeRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'VKV Travels API is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🚀 VKV Travels API Server`);
  console.log(`========================================`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  // console.log(`💾 Database: SQLite (database.db)`);
  console.log(`========================================\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  console.log('\nShutting down server...');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
