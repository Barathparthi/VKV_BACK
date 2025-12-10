const User = require('@/models/User');

// @desc    Create new user (Driver or Attender)
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
    try {
        const { name, phone, password, role, employeeCode, employeeNo, licenseNo } = req.body;

        // Validate required fields
        if (!name || !phone || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, phone, password, and role'
            });
        }

        // Validate role
        if (!['driver', 'attender'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Role must be either driver or attender'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this phone number already exists'
            });
        }

        // Auto-generate employee code and number if not provided
        let finalEmployeeCode = employeeCode;
        let finalEmployeeNo = employeeNo;

        if (!employeeCode || !employeeNo) {
            // Count existing users of the same role
            const count = await User.countDocuments({ role });
            const nextNumber = count + 1;

            // Generate employee code if not provided (e.g., DRV001, ATT001)
            if (!employeeCode) {
                const prefix = role === 'driver' ? 'DRV' : 'ATT';
                finalEmployeeCode = `${prefix}${String(nextNumber).padStart(3, '0')}`;
            }

            // Generate employee number if not provided (e.g., 1, 2, 3...)
            if (!employeeNo) {
                finalEmployeeNo = String(nextNumber);
            }
        }

        // Create user
        const user = await User.create({
            name,
            phone,
            password,
            role,
            employeeCode: finalEmployeeCode,
            employeeNo: finalEmployeeNo,
            licenseNo: role === 'driver' ? licenseNo : undefined,
            isActive: true
        });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            data: userResponse,
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully with Employee Code: ${finalEmployeeCode}`
        });
    } catch (error) {
        console.error('Error creating user:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Phone number already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
};

// @desc    Get all users (Drivers and Attenders)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const { role } = req.query;

        let query = { role: { $in: ['driver', 'attender'] } };

        if (role && ['driver', 'attender'].includes(role)) {
            query.role = role;
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, phone, employeeCode, employeeNo, licenseNo, isActive } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (employeeCode !== undefined) user.employeeCode = employeeCode;
        if (employeeNo !== undefined) user.employeeNo = employeeNo;
        if (licenseNo !== undefined && user.role === 'driver') user.licenseNo = licenseNo;
        if (isActive !== undefined) user.isActive = isActive;

        await user.save();

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            data: userResponse,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Error updating user:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Phone number already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting admin users
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users'
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

// @desc    Reset user password
// @route   PUT /api/admin/users/:id/password
// @access  Private/Admin
exports.resetUserPassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 4) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 4 characters long'
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
            error: error.message
        });
    }
};
