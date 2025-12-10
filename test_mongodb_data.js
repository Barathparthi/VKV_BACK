// Test script to verify MongoDB data
const mongoose = require('mongoose');
require('dotenv').config();

const Trip = require('./src/models/Trip');
const User = require('./src/models/User');

async function testMongoDBData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Count total trips
        const totalTrips = await Trip.countDocuments();
        console.log(`\n📊 Total Trips in Database: ${totalTrips}`);

        // Get all trips
        const allTrips = await Trip.find()
            .populate('driverId', 'name phone')
            .populate('vehicleId', 'vehicle_number')
            .sort({ date: -1 })
            .limit(10);

        console.log('\n📋 Last 10 Trips:');
        allTrips.forEach((trip, index) => {
            console.log(`\n${index + 1}. Trip ID: ${trip._id}`);
            console.log(`   Driver: ${trip.driverId?.name || 'N/A'}`);
            console.log(`   Vehicle: ${trip.vehicleId?.vehicle_number || 'N/A'}`);
            console.log(`   Type: ${trip.type}`);
            console.log(`   Date: ${trip.date}`);
            console.log(`   Status: ${trip.status}`);
            console.log(`   From: ${trip.from_location || 'N/A'}`);
            console.log(`   To: ${trip.to_location || 'N/A'}`);
            console.log(`   Total Salary: ₹${trip.total_salary || 0}`);
        });

        // Get pending trips
        const pendingTrips = await Trip.find({ status: 'pending' });
        console.log(`\n⏳ Pending Trips: ${pendingTrips.length}`);

        // Get approved trips
        const approvedTrips = await Trip.find({ status: 'approved' });
        console.log(`✅ Approved Trips: ${approvedTrips.length}`);

        // Get all drivers
        const drivers = await User.find({ role: 'driver' });
        console.log(`\n👨‍✈️ Total Drivers: ${drivers.length}`);
        drivers.forEach(driver => {
            console.log(`   - ${driver.name} (${driver.phone})`);
        });

        // Test date range query
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        console.log(`\n📅 Testing Date Range Query:`);
        console.log(`   Start: ${firstDay.toISOString().split('T')[0]}`);
        console.log(`   End: ${lastDay.toISOString().split('T')[0]}`);

        const thisMonthTrips = await Trip.find({
            date: { $gte: firstDay, $lte: lastDay }
        });
        console.log(`   Trips this month: ${thisMonthTrips.length}`);

        await mongoose.connection.close();
        console.log('\n✅ Test completed successfully');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testMongoDBData();
