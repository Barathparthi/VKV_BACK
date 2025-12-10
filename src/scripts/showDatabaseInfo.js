// Show detailed database information for MongoDB Compass verification
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

const connectionString =
  process.env.MONGO_URI || 'mongodb+srv://admin:admin123@cluster0.mp18txy.mongodb.net/vkv';

console.log('\n🔍 Database Connection Information:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Connection: ${connectionString.replace(/\/\/.*:.*@/, '//****:****@')}`);
console.log('Database Name: vkv');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const showDatabaseDetails = async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');
    console.log('📊 DATABASE COLLECTIONS AND DATA:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📦 Collections found:', collections.map((c) => c.name).join(', '));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // DRIVERS
    console.log('👤 DRIVERS COLLECTION (Collection Name: "users")');
    console.log('   Filter: { role: "driver" }');
    const drivers = await User.find({ role: 'driver' })
      .limit(10)
      .select('name phone employeeCode role isActive');
    console.log(`   Total Count: ${await User.countDocuments({ role: 'driver' })}`);
    console.log('\n   Sample Data (first 10):');
    drivers.forEach((d, i) => {
      console.log(
        `   ${i + 1}. ${d.name.padEnd(25)} | Phone: ${d.phone.padEnd(12)} | Code: ${d.employeeCode || 'N/A'}`,
      );
    });
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // ATTENDERS
    console.log('👥 ATTENDERS COLLECTION (Collection Name: "users")');
    console.log('   Filter: { role: "attender" }');
    const attenders = await User.find({ role: 'attender' })
      .limit(10)
      .select('name phone employeeCode role isActive');
    console.log(`   Total Count: ${await User.countDocuments({ role: 'attender' })}`);
    console.log('\n   Sample Data (first 10):');
    attenders.forEach((a, i) => {
      console.log(
        `   ${i + 1}. ${a.name.padEnd(25)} | Phone: ${a.phone.padEnd(12)} | Code: ${a.employeeCode || 'N/A'}`,
      );
    });
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // VEHICLES
    console.log('🚌 VEHICLES COLLECTION (Collection Name: "vehicles")');
    const vehicles = await Vehicle.find()
      .limit(10)
      .select('vehicle_number bus_type capacity status');
    console.log(`   Total Count: ${await Vehicle.countDocuments()}`);
    console.log('\n   Sample Data (first 10):');
    vehicles.forEach((v, i) => {
      console.log(
        `   ${i + 1}. ${v.vehicle_number.padEnd(15)} | Type: ${v.bus_type.padEnd(10)} | Capacity: ${String(v.capacity).padEnd(3)} | Status: ${v.status}`,
      );
    });
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // MONGODB COMPASS INSTRUCTIONS
    console.log('📍 HOW TO VIEW IN MONGODB COMPASS:\n');
    console.log('1. Open MongoDB Compass');
    console.log('2. Connect using this connection string:');
    console.log('   mongodb+srv://admin:admin123@cluster0.mp18txy.mongodb.net/vkv\n');
    console.log('3. After connecting, you should see:');
    console.log('   📂 Database: vkv');
    console.log('      ├─ 📄 users (contains drivers, attenders, and admin)');
    console.log('      └─ 📄 vehicles (contains all vehicles)\n');
    console.log('4. To filter data in Compass:');
    console.log('   • For DRIVERS: Click "users" collection, then filter:');
    console.log('     { "role": "driver" }');
    console.log('   • For ATTENDERS: Click "users" collection, then filter:');
    console.log('     { "role": "attender" }');
    console.log('   • For VEHICLES: Click "vehicles" collection (no filter needed)\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('💡 TIP: In MongoDB Compass, you can:');
    console.log('   • Click on any document to view full details');
    console.log('   • Use the Schema tab to see field types');
    console.log('   • Use the Indexes tab to see database indexes');
    console.log('   • Export data to JSON or CSV\n');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed\n');
    process.exit(0);
  }
};

showDatabaseDetails();
