const User = require('@/models/User');
const Trip = require('@/models/Trip');
const Vehicle = require('@/models/Vehicle');
const Salary = require('@/models/Salary');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard/stats
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalDrivers = await User.countDocuments({ role: 'driver' });
        const totalVehicles = await Vehicle.countDocuments();

        const startOfMonth = new Date();
        startOfMonth.setDate(1);

        const tripsThisMonth = await Trip.countDocuments({
            date: { $gte: startOfMonth },
            type: 'trip',
        });

        const pendingApprovals = await Trip.countDocuments({ status: 'pending' });

        res.status(200).json({
            success: true,
            data: {
                totalDrivers,
                totalVehicles,
                tripsThisMonth,
                pendingApprovals,
            },
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all trips (Admin)
// @route   GET /api/admin/trips
exports.getTrips = async (req, res, next) => {
    try {
        const { status, driverId, startDate, endDate } = req.query;
        let query = {};

        if (status) query.status = status;
        if (driverId) query.driverId = driverId;
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const trips = await Trip.find(query)
            .populate('driverId', 'name')
            .populate('vehicleId', 'vehicle_number')
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

// @desc    Approve/Reject trip
// @route   PUT /api/admin/trips/:id/:action
exports.approveOrRejectTrip = async (req, res, next) => {
    try {
        const { action } = req.params; // approve or reject
        const { adminNotes } = req.body;

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ error: 'Invalid action' });
        }

        const status = action === 'approve' ? 'approved' : 'rejected';

        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            {
                status,
                remarks: adminNotes,
                approved_by: req.user.id,
                approved_at: Date.now(),
            },
            { new: true },
        );

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        res.status(200).json({
            success: true,
            data: trip,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all drivers
// @route   GET /api/admin/drivers
exports.getDrivers = async (req, res, next) => {
    try {
        const drivers = await User.find({ role: 'driver' });
        res.status(200).json({
            success: true,
            count: drivers.length,
            data: drivers,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all attenders
// @route   GET /api/admin/attenders
exports.getAttenders = async (req, res, next) => {
    try {
        const attenders = await User.find({ role: 'attender' });
        res.status(200).json({
            success: true,
            count: attenders.length,
            data: attenders,
        });
    } catch (err) {
        next(err);
    }
};
