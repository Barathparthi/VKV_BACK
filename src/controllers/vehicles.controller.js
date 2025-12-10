const Vehicle = require('@/models/Vehicle');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private
exports.getVehicles = async (req, res, next) => {
    try {
        const vehicles = await Vehicle.find({ status: { $ne: 'inactive' } });
        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: vehicles,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create vehicle
// @route   POST /api/vehicles
// @access  Private (Admin)
exports.createVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json({
            success: true,
            data: vehicle,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Admin)
exports.updateVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        res.status(200).json({
            success: true,
            data: vehicle,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete vehicle (Soft delete)
// @route   DELETE /api/vehicles/:id
// @access  Private (Admin)
exports.deleteVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            {
                status: 'inactive',
            },
            { new: true },
        );

        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};
