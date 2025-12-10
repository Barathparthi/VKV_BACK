const User = require('@/models/User');

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private
exports.getDrivers = async (req, res, next) => {
    try {
        const { isActive } = req.query;
        let query = { role: 'driver' };

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const drivers = await User.find(query).select('-password');

        res.status(200).json({
            success: true,
            count: drivers.length,
            data: drivers,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get driver by ID
// @route   GET /api/drivers/:id
// @access  Private
exports.getDriver = async (req, res, next) => {
    try {
        const driver = await User.findOne({
            _id: req.params.id,
            role: 'driver',
        }).select('-password');

        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        res.status(200).json({
            success: true,
            data: driver,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new driver
// @route   POST /api/drivers
// @access  Private (Admin)
exports.createDriver = async (req, res, next) => {
    try {
        // Force role to be driver
        req.body.role = 'driver';

        const driver = await User.create(req.body);

        // Remove password from response
        driver.password = undefined;

        res.status(201).json({
            success: true,
            data: driver,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private (Admin)
exports.updateDriver = async (req, res, next) => {
    try {
        // Don't allow role change
        delete req.body.role;

        // Don't allow password update through this route
        delete req.body.password;

        const driver = await User.findOneAndUpdate({ _id: req.params.id, role: 'driver' }, req.body, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        res.status(200).json({
            success: true,
            data: driver,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete driver (soft delete)
// @route   DELETE /api/drivers/:id
// @access  Private (Admin)
exports.deleteDriver = async (req, res, next) => {
    try {
        const driver = await User.findOneAndUpdate(
            { _id: req.params.id, role: 'driver' },
            { isActive: false },
            { new: true },
        ).select('-password');

        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};
