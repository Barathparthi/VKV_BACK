// Verify seeded data in MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

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

const verifyData = async () => {
  try {
    console.log('\n📊 Verifying Database Data...\n');

    // Count drivers
    const driverCount = await User.countDocuments({ role: 'driver' });
    console.log(`👤 Drivers: ${driverCount}`);

    // Show first 3 drivers
    const sampleDrivers = await User.find({ role: 'driver' })
      .limit(3)
      .select('name phone employeeCode');
    console.log('   Sample drivers:');
    sampleDrivers.forEach((d) => console.log(`   - ${d.name} (${d.employeeCode}) - ${d.phone}`));

    console.log();

    // Count attenders
    const attenderCount = await User.countDocuments({ role: 'attender' });
    console.log(`👥 Attenders: ${attenderCount}`);

    // Show first 3 attenders
    const sampleAttenders = await User.find({ role: 'attender' })
      .limit(3)
      .select('name phone employeeCode');
    console.log('   Sample attenders:');
    sampleAttenders.forEach((a) => console.log(`   - ${a.name} (${a.employeeCode}) - ${a.phone}`));

    console.log();

    // Count vehicles
    const vehicleCount = await Vehicle.countDocuments();
    console.log(`🚌 Vehicles: ${vehicleCount}`);

    // Show first 3 vehicles
    const sampleVehicles = await Vehicle.find()
      .limit(3)
      .select('vehicle_number bus_type capacity status');
    console.log('   Sample vehicles:');
    sampleVehicles.forEach((v) =>
      console.log(`   - ${v.vehicle_number} (${v.bus_type}) - ${v.capacity} seats - ${v.status}`),
    );

    console.log('\n✅ Verification completed!\n');
  } catch (error) {
    console.error('❌ Verification failed:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

verifyData();
