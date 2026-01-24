const mongoose = require('mongoose');
require('module-alias/register');
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vkv-transport';

async function checkLocations() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const locationsCollection = mongoose.connection.db.collection('locations');

        // Find all locations with ernakulam (any casing)
        console.log('🔍 Searching for "ernakulam" in locations collection:\n');

        const locations = await locationsCollection.find({
            City: /ernakulam/i
        }).toArray();

        console.log(`Found ${locations.length} location(s):\n`);

        locations.forEach((loc, index) => {
            console.log(`${index + 1}. ID: ${loc._id}`);
            console.log(`   City: "${loc.City}"`);
            console.log('');
        });

        // List all locations
        console.log('\n📍 All locations in database:\n');
        const allLocations = await locationsCollection.find({}).sort({ City: 1 }).toArray();

        allLocations.forEach((loc, index) => {
            console.log(`${index + 1}. "${loc.City}"`);
        });

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkLocations();
