const Trip = require('@/models/Trip');

// @desc    Get all trips (with filters)
// @route   GET /api/trips
// @access  Private (Admin)
exports.getTrips = async (req, res, next) => {
    try {
        const { status, driverId, vehicleId, type, startDate, endDate } = req.query;
        let query = {};

        if (status) query.status = status;
        if (driverId) query.driverId = driverId;
        if (vehicleId) query.vehicleId = vehicleId;
        if (type) query.type = type;
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const trips = await Trip.find(query)
            .populate('driverId', 'name employeeCode phone')
            .populate('vehicleId', 'vehicle_number vehicle_type')
            .populate('submitted_by', 'name')
            .populate('approved_by', 'name')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: trips.length,
            data: trips,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get my trips
// @route   GET /api/trips/my-trips
// @access  Private
exports.getMyTrips = async (req, res, next) => {
    try {
        const { status, type, startDate, endDate } = req.query;
        let query = { driverId: req.user.id };

        if (status) query.status = status;
        if (type) query.type = type;
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const trips = await Trip.find(query)
            .populate('driverId', 'name employeeCode phone')
            .populate('vehicleId', 'vehicle_number vehicle_type')
            .populate('approved_by', 'name')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: trips.length,
            data: trips,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
exports.getTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id)
            .populate('driverId', 'name employeeCode phone')
            .populate('vehicleId', 'vehicle_number vehicle_type')
            .populate('submitted_by', 'name')
            .populate('approved_by', 'name');

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // Make sure user owns trip or is admin
        if (trip.driverId._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to view this trip' });
        }

        res.status(200).json({
            success: true,
            data: trip,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new trip
// @route   POST /api/trips
// @access  Private (Driver/Attender)
exports.createTrip = async (req, res, next) => {
    try {
        req.body.submitted_by = req.user.id;

        // If driver/attender, force their ID
        if (req.user.role !== 'admin') {
            req.body.driverId = req.user.id;
        }

        const trip = await Trip.create(req.body);

        // Populate and return
        const populatedTrip = await Trip.findById(trip._id)
            .populate('driverId', 'name employeeCode phone')
            .populate('vehicleId', 'vehicle_number vehicle_type')
            .populate('submitted_by', 'name');

        res.status(201).json({
            success: true,
            data: populatedTrip,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
exports.updateTrip = async (req, res, next) => {
    try {
        let trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // Make sure user owns trip or is admin
        if (trip.driverId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to update this trip' });
        }

        // Only allow update if pending (unless admin)
        if (trip.status !== 'pending' && req.user.role !== 'admin') {
            return res.status(400).json({ error: 'Cannot update processed trip' });
        }

        trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate('driverId', 'name employeeCode phone')
            .populate('vehicleId', 'vehicle_number vehicle_type')
            .populate('submitted_by', 'name')
            .populate('approved_by', 'name');

        res.status(200).json({
            success: true,
            data: trip,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
exports.deleteTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // Make sure user owns trip or is admin
        if (trip.driverId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this trip' });
        }

        // Only allow delete if pending (unless admin)
        if (trip.status !== 'pending' && req.user.role !== 'admin') {
            return res.status(400).json({ error: 'Cannot delete processed trip' });
        }

        await trip.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};
