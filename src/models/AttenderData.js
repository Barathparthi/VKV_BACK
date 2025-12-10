const mongoose = require('mongoose');

const attenderDataSchema = new mongoose.Schema({
    id: Number,
    name: String,
    phone: Number,
    employeeNo: String
}, { collection: 'attenders_data' });

module.exports = mongoose.model('AttenderData', attenderDataSchema);
