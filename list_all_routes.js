const mongoose = require('mongoose');
require('module-alias/register');
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URI;

async function listAllRoutes() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const routePriceCollection = mongoose.connection.db.collection('Route-price');

        // Get all routes
        const allRoutes = await routePriceCollection.find({}).sort({ from_location: 1, to_location: 1 }).toArray();

        console.log(`📊 Total routes in database: ${allRoutes.length}\n`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Group by from_location
        const grouped = {};
        allRoutes.forEach(route => {
            if (!grouped[route.from_location]) {
                grouped[route.from_location] = [];
            }
            grouped[route.from_location].push(route);
        });

        // Display grouped
        Object.keys(grouped).sort().forEach((from, index) => {
            console.log(`${index + 1}. From: ${from} (${grouped[from].length} destinations)`);
            grouped[from].forEach(route => {
                console.log(`   → ${route.to_location}: S:₹${route.driver_bata_single}, D:₹${route.driver_bata_double}, A:₹${route.cleaner_bata}`);
            });
            console.log('');
        });

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Check specific missing routes
        console.log('🔍 Checking specific routes mentioned as missing:\n');

        const checkRoutes = [
            { from: 'Chennai', to: 'ernakulam' },
            { from: 'Chennai', to: 'Ernakulam' },
            { from: 'Salaigramam', to: 'Chennai' },
            { from: 'Chennai', to: 'Salaigramam' },
            { from: 'Rajapalayam', to: 'Chennai' },
            { from: 'vizag', to: 'Chennai' },
            { from: 'Chennai', to: 'vizag' }
        ];

        for (const check of checkRoutes) {
            const found = await routePriceCollection.findOne({
                from_location: check.from,
                to_location: check.to
            });

            if (found) {
                console.log(`✅ ${check.from} → ${check.to}: S:₹${found.driver_bata_single}, D:₹${found.driver_bata_double}`);
            } else {
                console.log(`❌ ${check.from} → ${check.to}: NOT FOUND`);
            }
        }

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

listAllRoutes();
