const FuelEntry = require('@/models/FuelEntry');

// @desc    Add fuel entry
// @route   POST /api/fuel
// @access  Private (Admin)
exports.addFuelEntry = async (req, res, next) => {
    try {
        // Get previous reading for this vehicle
        const lastEntry = await FuelEntry.findOne({ vehicleId: req.body.vehicleId }).sort({
            date: -1,
            createdAt: -1,
        });

        if (lastEntry) {
            req.body.prev_reading = lastEntry.curr_reading;
        }

        const fuelEntry = await FuelEntry.create(req.body);

        res.status(201).json({
            success: true,
            data: fuelEntry,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all fuel entries
// @route   GET /api/fuel
// @access  Private (Admin)
exports.getFuelEntries = async (req, res, next) => {
    try {
        const fuelEntries = await FuelEntry.find()
            .populate('driverId', 'name')
            .populate('vehicleId', 'vehicle_number')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: fuelEntries.length,
            data: fuelEntries,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get latest reading for vehicle
// @route   GET /api/fuel/vehicle/:vehicleId/latest
// @access  Private
exports.getLatestReading = async (req, res, next) => {
    try {
        const lastEntry = await FuelEntry.findOne({ vehicleId: req.params.vehicleId }).sort({
            date: -1,
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            data: lastEntry ? lastEntry.curr_reading : 0,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update fuel entry
// @route   PUT /api/fuel/:id
// @access  Private (Admin)
exports.updateFuelEntry = async (req, res, next) => {
    try {
        const fuelEntry = await FuelEntry.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!fuelEntry) {
            return res.status(404).json({ error: 'Fuel entry not found' });
        }

        res.status(200).json({
            success: true,
            data: fuelEntry,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete fuel entry
// @route   DELETE /api/fuel/:id
// @access  Private (Admin)
exports.deleteFuelEntry = async (req, res, next) => {
    try {
        const fuelEntry = await FuelEntry.findByIdAndDelete(req.params.id);

        if (!fuelEntry) {
            return res.status(404).json({ error: 'Fuel entry not found' });
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};
