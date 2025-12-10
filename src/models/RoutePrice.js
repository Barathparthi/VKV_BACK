const mongoose = require('mongoose');

const routePriceSchema = new mongoose.Schema({
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
    driver_bata_single: {
        type: Number,
        required: true,
        default: 0
    },
    driver_bata_double: {
        type: Number,
        required: true,
        default: 0
    },
    cleaner_bata: {
        type: Number,
        required: true,
        default: 0
    }
}, { collection: 'Route-price' }); // Explicitly bind to the collection name mentioned by user

// Compound index for unique routes
routePriceSchema.index({ from_location: 1, to_location: 1 }, { unique: true });

module.exports = mongoose.model('RoutePrice', routePriceSchema);
