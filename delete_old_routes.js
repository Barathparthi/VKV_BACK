const mongoose = require('mongoose');
require('dotenv').config();

async function cleanOldData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected');

        // Delete the old routes collection with demo data
        const routesCollection = mongoose.connection.collection('routes');
        const result = await routesCollection.deleteMany({});
        console.log(`🗑️ Deleted ${result.deletedCount} documents from 'routes' collection`);

        // Verify Route-price still has data
        const RoutePriceCollection = mongoose.connection.collection('Route-price');
        const priceCount = await RoutePriceCollection.countDocuments();
        console.log(`✅ Route-price collection still has ${priceCount} documents`);

        const samplePrices = await RoutePriceCollection.find({}).limit(3).toArray();
        console.log('\nSample Route-price data:');
        samplePrices.forEach(p => {
            console.log(`  ${p.from_location} -> ${p.to_location}: Single=₹${p.driver_bata_single}, Double=₹${p.driver_bata_double}, Cleaner=₹${p.cleaner_bata}`);
        });

    } catch (err) {
        console.error('Error:', err);
    } finally {
        mongoose.connection.close();
    }
}

cleanOldData();
