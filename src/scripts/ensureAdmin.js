// Ensure admin user exists in MongoDB (without deleting other data)
require('module-alias/register');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('@/models/User');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const ensureAdmin = async () => {
  try {
    console.log('\n🔐 Checking for admin user...\n');

    // Check if admin exists
    const existingAdmin = await User.findOne({ phone: 'admin', role: 'admin' });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Phone: ${existingAdmin.phone}`);
      console.log(`   Employee Code: ${existingAdmin.employeeCode || 'N/A'}`);
    } else {
      console.log('⚠️  Admin user not found. Creating...');

      const admin = await User.create({
        name: 'Admin User',
        phone: 'admin',
        password: 'admin123',
        role: 'admin',
        employeeCode: 'ADM001',
        isActive: true,
      });

      console.log('✅ Admin user created successfully!');
      console.log(`   Name: ${admin.name}`);
      console.log(`   Phone: ${admin.phone}`);
      console.log(`   Employee Code: ${admin.employeeCode}`);
    }

    console.log('\n📝 Admin Login Credentials:');
    console.log('   Phone: admin');
    console.log('   Password: admin123');
    console.log('   Role: admin\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed\n');
    process.exit(0);
  }
};

ensureAdmin();
