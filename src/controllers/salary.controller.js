const Salary = require('@/models/Salary');
const Trip = require('@/models/Trip');

// @desc    Get all salaries
// @route   GET /api/salary
// @access  Private (Admin)
exports.getSalaries = async (req, res, next) => {
    try {
        const { month, year, driverId, status } = req.query;
        let query = {};

        if (month) query.month = parseInt(month);
        if (year) query.year = parseInt(year);
        if (driverId) query.driverId = driverId;
        if (status) query.status = status;

        const salaries = await Salary.find(query)
            .populate('driverId', 'name employeeCode phone')
            .sort({ year: -1, month: -1 });

        res.status(200).json({
            success: true,
            count: salaries.length,
            data: salaries,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get salary by ID
// @route   GET /api/salary/:id
// @access  Private
exports.getSalary = async (req, res, next) => {
    try {
        const salary = await Salary.findById(req.params.id).populate(
            'driverId',
            'name employeeCode phone',
        );

        if (!salary) {
            return res.status(404).json({ error: 'Salary record not found' });
        }

        // Make sure user owns salary or is admin
        if (salary.driverId._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to view this salary record' });
        }

        res.status(200).json({
            success: true,
            data: salary,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get my salary history
// @route   GET /api/salary/my-salary
// @access  Private
exports.getMySalary = async (req, res, next) => {
    try {
        const salaries = await Salary.find({ driverId: req.user.id })
            .populate('driverId', 'name employeeCode phone')
            .sort({ year: -1, month: -1 });

        res.status(200).json({
            success: true,
            count: salaries.length,
            data: salaries,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Calculate monthly salary
// @route   POST /api/salary/calculate-monthly
// @access  Private (Admin)
exports.calculateMonthlySalary = async (req, res, next) => {
    try {
        const { month, year, driverId, day } = req.body;

        // Find all trips for this month/year
        const startDate = new Date(year, month - 1, 1);

        // If day is provided, calculate up to that day (end of day). Otherwise, end of month.
        const endDate = day
            ? new Date(year, month - 1, day, 23, 59, 59, 999)
            : new Date(year, month, 0, 23, 59, 59, 999);

        // Build match stage
        const matchStage = {
            date: { $gte: startDate, $lte: endDate },
            status: 'approved', // Only count approved trips
        };

        if (driverId) {
            const mongoose = require('mongoose');
            matchStage.driverId = new mongoose.Types.ObjectId(driverId);
        }

        // Aggregate trips by driver
        const salaryData = await Trip.aggregate([
            {
                $match: matchStage,
            },
            {
                $group: {
                    _id: '$driverId',
                    total_trips: {
                        $sum: { $cond: [{ $eq: ['$type', 'trip'] }, 1, 0] },
                    },
                    total_halt: {
                        $sum: { $cond: [{ $eq: ['$type', 'halt'] }, 1, 0] },
                    },
                    total_leave: {
                        $sum: { $cond: [{ $eq: ['$type', 'leave'] }, 1, 0] },
                    },
                    total_distance: { $sum: '$distance' },
                    base_salary: { $sum: '$base_salary' },
                    halt_allowance: { $sum: '$halt_allowance' },
                    mileage_bonus: { $sum: '$mileage_bonus' },
                    total_salary: { $sum: '$total_salary' },
                },
            },
        ]);

        // If specific driver requested but no trips found, we might want to ensure a 0-filled record exists or similar? 
        // But for now, if no trips, aggregate returns empty. 
        // However, we should probably handle the case where we want to update even if 0 trips (e.g. to clear previous stats).
        // But the previous logic only iterated over `salaryData`. 
        // If we want to strictly follow "fetch from driver portal", logic dictates we process found trips.

        // Create/Update salary records
        const results = [];
        for (const data of salaryData) {
            const salary = await Salary.findOneAndUpdate(
                { driverId: data._id, month, year },
                {
                    ...data,
                    driverId: data._id,
                    month,
                    year,
                    // Don't reset status if it's already approved? 
                    // The user requirement implies refreshing data. 
                    // Usually if approved, we shouldn't change it. But for "Salary Approval" flow, usually we are in 'pending'.
                    // Let's reset to pending if we are recalculating, unless maybe it's paid.
                    // For safety, let's keep it 'pending' as per previous code.
                    status: 'pending',
                },
                { upsert: true, new: true },
            ).populate('driverId', 'name employeeCode phone');
            results.push(salary);
        }

        res.status(200).json({
            success: true,
            count: results.length,
            data: results,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create/Update salary manually
// @route   POST /api/salary
// @access  Private (Admin)
exports.createOrUpdateSalaryManually = async (req, res, next) => {
    try {
        const { driverId, month, year } = req.body;

        const salary = await Salary.findOneAndUpdate({ driverId, month, year }, req.body, {
            upsert: true,
            new: true,
            runValidators: true,
            // Create if doesn't exist
        }).populate('driverId', 'name employeeCode phone');

        res.status(201).json({
            success: true,
            data: salary,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update salary
// @route   PUT /api/salary/:id
// @access  Private (Admin)
exports.updateSalary = async (req, res, next) => {
    try {
        const salary = await Salary.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('driverId', 'name employeeCode phone');

        if (!salary) {
            return res.status(404).json({ error: 'Salary record not found' });
        }

        res.status(200).json({
            success: true,
            data: salary,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Approve salary
// @route   PUT /api/salary/:id/approve
// @access  Private (Admin)
exports.approveSalary = async (req, res, next) => {
    try {
        const salary = await Salary.findByIdAndUpdate(
            req.params.id,
            {
                status: 'approved',
                approved_at: Date.now(),
            },
            { new: true },
        ).populate('driverId', 'name employeeCode phone');

        if (!salary) {
            return res.status(404).json({ error: 'Salary record not found' });
        }

        res.status(200).json({
            success: true,
            data: salary,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark salary as paid
// @route   PUT /api/salary/:id/paid
// @access  Private (Admin)
exports.markSalaryAsPaid = async (req, res, next) => {
    try {
        const salary = await Salary.findByIdAndUpdate(
            req.params.id,
            {
                status: 'paid',
                paid_at: Date.now(),
            },
            { new: true },
        ).populate('driverId', 'name employeeCode phone');

        if (!salary) {
            return res.status(404).json({ error: 'Salary record not found' });
        }

        res.status(200).json({
            success: true,
            data: salary,
        });
    } catch (err) {
        next(err);
    }
};
