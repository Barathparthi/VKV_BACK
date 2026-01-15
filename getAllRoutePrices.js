// Script to fetch all routes from Route-price collection
const mongoose = require('mongoose');
require('dotenv').config();

const RoutePrice = require('./src/models/RoutePrice');

async function getAllRoutePrices() {
    try {
        console.log('\n🔄 Connecting to MongoDB...\n');

        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vkv-travels');

        console.log('✅ Connected to MongoDB\n');
        console.log('━'.repeat(80));
        console.log('📍 FETCHING ALL ROUTES FROM Route-price COLLECTION');
        console.log('━'.repeat(80));

        // Fetch all routes from Route-price collection
        const routePrices = await RoutePrice.find({}).sort({ from_location: 1, to_location: 1 });

        console.log(`\n📊 Total Routes in Route-price Collection: ${routePrices.length}\n`);

        if (routePrices.length === 0) {
            console.log('⚠️  No routes found in Route-price collection.');
        } else {
            // Group by starting location
            const groupedRoutes = routePrices.reduce((acc, route) => {
                const from = route.from_location;
                if (!acc[from]) {
                    acc[from] = [];
                }
                acc[from].push(route);
                return acc;
            }, {});

            let routeNumber = 1;
            for (const [fromLocation, routesList] of Object.entries(groupedRoutes)) {
                console.log('\n' + '═'.repeat(80));
                console.log(`📍 FROM: ${fromLocation.toUpperCase()}`);
                console.log('═'.repeat(80));

                routesList.forEach((route) => {
                    console.log(`\n${routeNumber}. ${route.from_location} → ${route.to_location}`);
                    console.log('   ├─ ID:', route._id);
                    console.log('   ├─ Driver Bata (Single):', '₹' + route.driver_bata_single);
                    console.log('   ├─ Driver Bata (Double):', '₹' + route.driver_bata_double);
                    console.log('   └─ Attender Bata:', '₹' + route.cleaner_bata);
                    routeNumber++;
                });
            }

            // Summary
            console.log('\n' + '━'.repeat(80));
            console.log('📈 SUMMARY');
            console.log('━'.repeat(80));

            const uniqueFromLocations = new Set(routePrices.map(r => r.from_location)).size;
            const uniqueToLocations = new Set(routePrices.map(r => r.to_location)).size;
            const allLocations = new Set([
                ...routePrices.map(r => r.from_location),
                ...routePrices.map(r => r.to_location)
            ]);

            console.log(`\n   Total Routes:           ${routePrices.length}`);
            console.log(`   Unique From Locations:  ${uniqueFromLocations}`);
            console.log(`   Unique To Locations:    ${uniqueToLocations}`);
            console.log(`   Total Unique Locations: ${allLocations.size}`);

            console.log('\n   All Locations:');
            Array.from(allLocations).sort().forEach((loc, idx) => {
                console.log(`      ${idx + 1}. ${loc}`);
            });

            // Export to JSON
            const fs = require('fs');
            const exportData = {
                exportDate: new Date().toISOString(),
                totalRoutes: routePrices.length,
                routes: routePrices
            };

            const fileName = `route_prices_export_${Date.now()}.json`;
            fs.writeFileSync(fileName, JSON.stringify(exportData, null, 2));
            console.log(`\n💾 Route prices exported to: ${fileName}`);
        }

        console.log('\n' + '━'.repeat(80));
        console.log('✅ OPERATION COMPLETED');
        console.log('━'.repeat(80) + '\n');

    } catch (error) {
        console.error('\n❌ Error:', error);
        console.error('Error details:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed\n');
        process.exit(0);
    }
}

getAllRoutePrices();
