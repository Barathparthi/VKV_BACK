const mongoose = require('mongoose');

const fuelEntrySchema = new mongoose.Schema({
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
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    time: {
        type: String,
        required: true
    },
    station: {
        type: String,
        required: true
    },
    liters: {
        type: Number,
        required: true
    },
    prev_reading: {
        type: Number,
        required: true
    },
    curr_reading: {
        type: Number,
        required: true
    },
    mileage: {
        type: Number,
        default: 0
    },
    default_mileage: {
        type: Number,
        required: true
    },
    mileage_bonus: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Pre-save hook to calculate mileage and bonus
fuelEntrySchema.pre('save', function (next) {
    if (this.curr_reading > this.prev_reading && this.liters > 0) {
        this.mileage = (this.curr_reading - this.prev_reading) / this.liters;

        // Bonus calculation: 150 if mileage > default_mileage
        if (this.mileage > this.default_mileage) {
            this.mileage_bonus = 150;
        } else {
            this.mileage_bonus = 0;
        }
    }
    next();
});

module.exports = mongoose.model('FuelEntry', fuelEntrySchema);
