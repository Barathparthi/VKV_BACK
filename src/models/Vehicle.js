const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicle_number: {
        type: String,
        required: [true, 'Vehicle number is required'],
        unique: true,
        uppercase: true
    },
    bus_type: {
        type: String,
        required: [true, 'Bus type is required'],
        enum: ['AC', 'NON-AC', 'SLEEPER', 'SEATER']
    },
    default_mileage: {
        type: Number,
        required: [true, 'Default mileage is required']
    },
    capacity: {
        type: Number,
        required: [true, 'Seating capacity is required']
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    },
    insurance_details: {
        policy_number: String,
        expiry_date: Date,
        provider: String
    },
    last_service_date: Date,
    next_service_date: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
