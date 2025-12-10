// models/Route.js
const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    from_location: {
        type: String,
        required: true,
        trim: true
    },
    to_location: {
        type: String,
        required: true,
        trim: true
    },
    distance: {
        type: Number,
        required: true,
        min: 0
    },
    is_active: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Create a compound index to prevent duplicate routes
routeSchema.index({ from_location: 1, to_location: 1 }, { unique: true });

// Update the updated_at timestamp before saving
routeSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Route', routeSchema);
