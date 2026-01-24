const mongoose = require('mongoose');
require('module-alias/register');
const RoutePrice = require('@/models/RoutePrice');
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vkv-transport';


async function cleanupDuplicateRoutes() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find all route prices
        const allPrices = await RoutePrice.find({});
        console.log(`📊 Total routes found: ${allPrices.length}`);

        // Group by normalized location names (case-insensitive)
        const routeMap = new Map();

        for (const price of allPrices) {
            const key = `${price.from_location.toLowerCase()}|${price.to_location.toLowerCase()}`;

            if (!routeMap.has(key)) {
                routeMap.set(key, []);
            }
            routeMap.get(key).push(price);
        }

        // Find duplicates
        let duplicatesFound = 0;
        let duplicatesRemoved = 0;

        for (const [key, routes] of routeMap.entries()) {
            if (routes.length > 1) {
                duplicatesFound++;
                console.log(`\n🔍 Found ${routes.length} duplicates for: ${key}`);

                routes.forEach((route, index) => {
                    console.log(`  ${index + 1}. ID: ${route._id}, From: "${route.from_location}", To: "${route.to_location}"`);
                    console.log(`     Single: ₹${route.driver_bata_single}, Double: ₹${route.driver_bata_double}, Attender: ₹${route.cleaner_bata}`);
                });

                // Keep the one with the highest prices (most likely the correct one)
                // Or keep the most recently updated one
                routes.sort((a, b) => {
                    // First, prefer non-zero prices
                    const aTotal = (a.driver_bata_single || 0) + (a.driver_bata_double || 0) + (a.cleaner_bata || 0);
                    const bTotal = (b.driver_bata_single || 0) + (b.driver_bata_double || 0) + (b.cleaner_bata || 0);

                    if (aTotal !== bTotal) return bTotal - aTotal;

                    // If same total, prefer the one with updatedAt (if exists)
                    if (a.updatedAt && b.updatedAt) {
                        return b.updatedAt - a.updatedAt;
                    }

                    return 0;
                });

                const keepRoute = routes[0];
                const removeRoutes = routes.slice(1);

                console.log(`  ✅ Keeping: ${keepRoute._id} (${keepRoute.from_location} → ${keepRoute.to_location})`);
                console.log(`     Prices: S:₹${keepRoute.driver_bata_single}, D:₹${keepRoute.driver_bata_double}, A:₹${keepRoute.cleaner_bata}`);

                // Remove duplicates
                for (const route of removeRoutes) {
                    console.log(`  ❌ Removing: ${route._id}`);
                    await RoutePrice.findByIdAndDelete(route._id);
                    duplicatesRemoved++;
                }
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   Total routes: ${allPrices.length}`);
        console.log(`   Duplicate groups found: ${duplicatesFound}`);
        console.log(`   Duplicate entries removed: ${duplicatesRemoved}`);
        console.log(`   Final route count: ${allPrices.length - duplicatesRemoved}`);

        await mongoose.disconnect();
        console.log('\n✅ Cleanup completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    }
}

cleanupDuplicateRoutes();
