const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    City: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { collection: 'Routes' });

module.exports = mongoose.model('Location', locationSchema);
