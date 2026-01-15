// Script to fetch and display all routes from MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

const RouteModel = require('./src/models/Route');
const RoutePrice = require('./src/models/RoutePrice');

async function getAllRoutes() {
    try {
        console.log('\n🔄 Connecting to MongoDB...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vkv-travels');

        console.log('✅ Connected to MongoDB\n');
        console.log('━'.repeat(80));
        console.log('📍 FETCHING ALL ROUTES FROM DATABASE');
        console.log('━'.repeat(80));

        // Fetch all routes with their price information
        const routes = await RouteModel.aggregate([
            {
                $lookup: {
                    from: 'Route-price',
                    let: { from: '$from_location', to: '$to_location' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$from_location', '$$from'] },
                                        { $eq: ['$to_location', '$$to'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'priceInfo'
                }
            },
            {
                $unwind: {
                    path: '$priceInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    from_location: 1,
                    to_location: 1,
                    distance: 1,
                    is_active: 1,
                    driver_bata_single: { $ifNull: ['$priceInfo.driver_bata_single', 0] },
                    driver_bata_double: { $ifNull: ['$priceInfo.driver_bata_double', 0] },
                    cleaner_bata: { $ifNull: ['$priceInfo.cleaner_bata', 0] },
                    created_at: 1,
                    updated_at: 1
                }
            },
            { $sort: { from_location: 1, to_location: 1 } }
        ]);

        console.log(`\n📊 Total Routes Found: ${routes.length}\n`);

        if (routes.length === 0) {
            console.log('⚠️  No routes found in the database.');
            console.log('\n💡 To add routes, you can:');
            console.log('   1. Use the Admin Dashboard Route Management interface');
            console.log('   2. Run the seed script: node src/scripts/seedRoutes.js\n');
        } else {
            // Group routes by starting location
            const groupedRoutes = routes.reduce((acc, route) => {
                const from = route.from_location;
                if (!acc[from]) {
                    acc[from] = [];
                }
                acc[from].push(route);
                return acc;
            }, {});

            // Display routes grouped by starting location
            let routeNumber = 1;
            for (const [fromLocation, routesList] of Object.entries(groupedRoutes)) {
                console.log('\n' + '═'.repeat(80));
                console.log(`📍 FROM: ${fromLocation.toUpperCase()}`);
                console.log('═'.repeat(80));

                routesList.forEach((route) => {
                    console.log(`\n${routeNumber}. Route Details:`);
                    console.log('   ├─ ID:', route._id);
                    console.log('   ├─ From:', route.from_location);
                    console.log('   ├─ To:', route.to_location);
                    console.log('   ├─ Distance:', route.distance, 'km');
                    console.log('   ├─ Status:', route.is_active ? '✅ Active' : '❌ Inactive');
                    console.log('   ├─ Driver Bata (Single):', '₹' + route.driver_bata_single);
                    console.log('   ├─ Driver Bata (Double):', '₹' + route.driver_bata_double);
                    console.log('   ├─ Attender Bata:', '₹' + route.cleaner_bata);
                    console.log('   ├─ Created:', new Date(route.created_at).toLocaleString());
                    console.log('   └─ Updated:', new Date(route.updated_at).toLocaleString());
                    routeNumber++;
                });
            }

            // Summary statistics
            console.log('\n' + '━'.repeat(80));
            console.log('📈 SUMMARY STATISTICS');
            console.log('━'.repeat(80));

            const activeRoutes = routes.filter(r => r.is_active);
            const inactiveRoutes = routes.filter(r => !r.is_active);
            const totalDistance = routes.reduce((sum, r) => sum + (r.distance || 0), 0);
            const avgDistance = routes.length > 0 ? (totalDistance / routes.length).toFixed(2) : 0;
            const uniqueFromLocations = new Set(routes.map(r => r.from_location)).size;
            const uniqueToLocations = new Set(routes.map(r => r.to_location)).size;
            const allLocations = new Set([
                ...routes.map(r => r.from_location),
                ...routes.map(r => r.to_location)
            ]);

            console.log(`\n   Total Routes:           ${routes.length}`);
            console.log(`   Active Routes:          ${activeRoutes.length}`);
            console.log(`   Inactive Routes:        ${inactiveRoutes.length}`);
            console.log(`   Total Distance:         ${totalDistance} km`);
            console.log(`   Average Distance:       ${avgDistance} km`);
            console.log(`   Unique From Locations:  ${uniqueFromLocations}`);
            console.log(`   Unique To Locations:    ${uniqueToLocations}`);
            console.log(`   Total Unique Locations: ${allLocations.size}`);

            console.log('\n   All Locations:');
            Array.from(allLocations).sort().forEach((loc, idx) => {
                console.log(`      ${idx + 1}. ${loc}`);
            });

            // Export to JSON file
            const fs = require('fs');
            const exportData = {
                exportDate: new Date().toISOString(),
                totalRoutes: routes.length,
                activeRoutes: activeRoutes.length,
                inactiveRoutes: inactiveRoutes.length,
                routes: routes
            };

            const fileName = `routes_export_${Date.now()}.json`;
            fs.writeFileSync(fileName, JSON.stringify(exportData, null, 2));
            console.log(`\n💾 Routes exported to: ${fileName}`);
        }

        console.log('\n' + '━'.repeat(80));
        console.log('✅ OPERATION COMPLETED SUCCESSFULLY');
        console.log('━'.repeat(80) + '\n');

    } catch (error) {
        console.error('\n❌ Error fetching routes:', error);
        console.error('Error details:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed\n');
        process.exit(0);
    }
}

// Run the script
getAllRoutes();
