const mongoose = require('mongoose');
require('module-alias/register');
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vkv-transport';

async function findAllChennaiErnakulam() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const routePriceCollection = mongoose.connection.db.collection('Route-price');

        // Search for all variations
        console.log('🔍 Searching for all Chennai ↔ Ernakulam routes (any casing):\n');

        const routes = await routePriceCollection.find({
            $or: [
                {
                    from_location: /chennai/i,
                    to_location: /ernakulam/i
                },
                {
                    from_location: /ernakulam/i,
                    to_location: /chennai/i
                }
            ]
        }).toArray();

        console.log(`Found ${routes.length} routes:\n`);

        routes.forEach((route, index) => {
            console.log(`${index + 1}. ID: ${route._id}`);
            console.log(`   From: "${route.from_location}" → To: "${route.to_location}"`);
            console.log(`   Driver Bata (S): ₹${route.driver_bata_single}`);
            console.log(`   Driver Bata (D): ₹${route.driver_bata_double}`);
            console.log(`   Attender Bata: ₹${route.cleaner_bata}`);
            console.log('');
        });

        // Also check for any route with 1360 or 1480
        console.log('\n🔍 Searching for routes with ₹1360 or ₹1480:\n');

        const priceMatches = await routePriceCollection.find({
            $or: [
                { driver_bata_double: 1360 },
                { driver_bata_double: 1480 },
                { driver_bata_single: 1360 },
                { driver_bata_single: 1480 }
            ]
        }).toArray();

        console.log(`Found ${priceMatches.length} routes with these prices:\n`);

        priceMatches.forEach((route, index) => {
            console.log(`${index + 1}. ${route.from_location} → ${route.to_location}`);
            console.log(`   Single: ₹${route.driver_bata_single}, Double: ₹${route.driver_bata_double}`);
            console.log('');
        });

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

findAllChennaiErnakulam();
