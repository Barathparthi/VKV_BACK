const jwt = require('jsonwebtoken');
const User = require('@/models/User');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// @desc    Register user (Admin only)
// @route   POST /api/auth/register
// @access  Private/Admin
exports.register = async (req, res, next) => {
    try {
        // Only admin can register users
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to register users' });
        }

        const { name, phone, password, role, ...otherDetails } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Generate employee code
        const count = await User.countDocuments({ role });
        const prefix = role === 'driver' ? 'DRV' : role === 'attender' ? 'ATT' : 'ADM';
        const employeeCode = `${prefix}${String(count + 1).padStart(3, '0')}`;

        // Create user based on role
        let user;
        const userData = {
            name,
            phone,
            password,
            role,
            employeeCode,
            ...otherDetails,
        };

        if (role === 'driver') {
            const { Driver } = require('@/models/User');
            user = await Driver.create(userData);
        } else if (role === 'attender') {
            const { Attender } = require('@/models/User');
            user = await Attender.create(userData);
        } else {
            user = await User.create(userData);
        }

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                employeeCode: user.employeeCode,
            },
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { phone, password, role } = req.body;

        // Validate email & password
        if (!phone || !password) {
            return res.status(400).json({ error: 'Please provide phone and password' });
        }

        // Check for user
        const user = await User.findOne({ phone }).select('+password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check role
        if (role && user.role !== role) {
            return res.status(401).json({ error: 'Invalid role for this user' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                employeeCode: user.employeeCode,
            },
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        if (!(await user.matchPassword(currentPassword))) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (err) {
        next(err);
    }
};
