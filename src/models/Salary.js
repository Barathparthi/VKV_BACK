const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    total_trips: {
        type: Number,
        default: 0
    },
    total_halt: {
        type: Number,
        default: 0
    },
    total_leave: {
        type: Number,
        default: 0
    },
    total_distance: {
        type: Number,
        default: 0
    },
    base_salary: {
        type: Number,
        default: 0
    },
    halt_allowance: {
        type: Number,
        default: 0
    },
    mileage_bonus: {
        type: Number,
        default: 0
    },
    total_salary: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'paid'],
        default: 'pending'
    },
    generated_at: {
        type: Date,
        default: Date.now
    },
    approved_at: Date,
    paid_at: Date
}, {
    timestamps: true
});

// Compound index to ensure one salary record per driver per month
salarySchema.index({ driverId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Salary', salarySchema);
