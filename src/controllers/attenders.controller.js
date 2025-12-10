const AttenderData = require('@/models/AttenderData');

// @desc    Get all attenders
// @route   GET /api/attenders
// @access  Public
exports.getAttenders = async (req, res, next) => {
    try {
        // Fetch from the authoritative attenders_data collection
        const attenders = await AttenderData.find({});

        res.status(200).json({
            success: true,
            count: attenders.length,
            data: attenders,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get attender by ID
// @route   GET /api/attenders/:id
// @access  Private
exports.getAttender = async (req, res, next) => {
    try {
        const attender = await User.findOne({
            _id: req.params.id,
            role: 'attender',
        }).select('-password');

        if (!attender) {
            return res.status(404).json({ error: 'Attender not found' });
        }

        res.status(200).json({
            success: true,
            data: attender,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new attender
// @route   POST /api/attenders
// @access  Private (Admin)
exports.createAttender = async (req, res, next) => {
    try {
        // Force role to be attender
        req.body.role = 'attender';

        const attender = await User.create(req.body);

        // Remove password from response
        attender.password = undefined;

        res.status(201).json({
            success: true,
            data: attender,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update attender
// @route   PUT /api/attenders/:id
// @access  Private (Admin)
exports.updateAttender = async (req, res, next) => {
    try {
        // Don't allow role change
        delete req.body.role;

        // Don't allow password update through this route
        delete req.body.password;

        const attender = await User.findOneAndUpdate(
            { _id: req.params.id, role: 'attender' },
            req.body,
            { new: true, runValidators: true },
        ).select('-password');

        if (!attender) {
            return res.status(404).json({ error: 'Attender not found' });
        }

        res.status(200).json({
            success: true,
            data: attender,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete attender (soft delete)
// @route   DELETE /api/attenders/:id
// @access  Private (Admin)
exports.deleteAttender = async (req, res, next) => {
    try {
        const attender = await User.findOneAndUpdate(
            { _id: req.params.id, role: 'attender' },
            { isActive: false },
            { new: true },
        ).select('-password');

        if (!attender) {
            return res.status(404).json({ error: 'Attender not found' });
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};
