const mongoose = require('mongoose');
require('module-alias/register');
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URI;

async function verifyRoute() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const routePriceCollection = mongoose.connection.db.collection('Route-price');

        // Check Chennai → Ernakulam
        const route = await routePriceCollection.findOne({
            from_location: /^chennai$/i,
            to_location: /^ernakulam$/i
        });

        if (route) {
            console.log('📍 Chennai → Ernakulam Route:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`   From: "${route.from_location}"`);
            console.log(`   To: "${route.to_location}"`);
            console.log(`   Driver Bata (Single): ₹${route.driver_bata_single}`);
            console.log(`   Driver Bata (Double): ₹${route.driver_bata_double} ${route.driver_bata_double === 1480 ? '✅' : '❌'}`);
            console.log(`   Attender Bata: ₹${route.cleaner_bata}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            if (route.driver_bata_double === 1480) {
                console.log('✅ Route is correctly set to ₹1480 for Double service!\n');
            } else {
                console.log(`❌ Route has incorrect price: ₹${route.driver_bata_double} (expected ₹1480)\n`);
            }
        } else {
            console.log('❌ Route not found in database\n');
        }

        // Check for any duplicates
        const allMatches = await routePriceCollection.find({
            from_location: /^chennai$/i,
            to_location: /^ernakulam$/i
        }).toArray();

        console.log(`📊 Total matching routes found: ${allMatches.length}`);
        if (allMatches.length > 1) {
            console.log('⚠️  WARNING: Multiple duplicates still exist!\n');
            allMatches.forEach((r, i) => {
                console.log(`   ${i + 1}. ID: ${r._id}, Double: ₹${r.driver_bata_double}`);
            });
        } else {
            console.log('✅ No duplicates - database is clean!\n');
        }

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

verifyRoute();
