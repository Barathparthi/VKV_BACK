const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    type: {
        type: String,
        enum: ['trip', 'halt', 'leave'],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    from_location: {
        type: String,
        required: function () { return this.type === 'trip'; }
    },
    to_location: {
        type: String,
        required: function () { return this.type === 'trip'; }
    },
    distance: {
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
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    rating_bonus: {
        type: Number,
        default: 0
    },
    total_salary: {
        type: Number,
        default: 0
    },
    trip_type: {
        type: String,
        enum: ['Single', 'Double'],
        default: 'Single'
    },
    route: {
        type: String
    },
    attender_name: {
        type: String
    },
    attender_phone: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    remarks: String,
    submitted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approved_at: Date
}, {
    timestamps: true
});

// Pre-save hook to calculate salary
tripSchema.pre('save', function (next) {
    if (this.type === 'trip') {
        // For trips, use the base_salary from frontend (bata amount)
        // Don't recalculate based on distance
        if (!this.base_salary) {
            this.base_salary = (this.distance || 0) * 10; // 10 per km as fallback
        }
        this.halt_allowance = 0;
    } else if (this.type === 'halt') {
        this.base_salary = 0;
        this.halt_allowance = 500; // 500 per halt
    } else {
        this.base_salary = 0;
        this.halt_allowance = 0;
    }

    this.total_salary = this.base_salary + this.halt_allowance + (this.mileage_bonus || 0) + (this.rating_bonus || 0);
    next();
});

module.exports = mongoose.model('Trip', tripSchema);
