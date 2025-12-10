const mongoose = require('mongoose');
require('dotenv').config();

async function listCollections() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📦 Collections in database:');
        collections.forEach(col => {
            console.log(`  - ${col.name}`);
        });

        // Check the cities collection
        const citiesCollection = mongoose.connection.collection('cities');
        const citiesCount = await citiesCollection.countDocuments();
        console.log(`\n🏙️ Cities collection has ${citiesCount} documents`);

        const sampleCities = await citiesCollection.find({}).limit(5).toArray();
        console.log('Sample cities:', sampleCities);

        // Check routes collection
        const routesCollection = mongoose.connection.collection('routes');
        const routesCount = await routesCollection.countDocuments();
        console.log(`\n🛣️ Routes collection has ${routesCount} documents`);

        const sampleRoutes = await routesCollection.find({}).limit(3).toArray();
        console.log('Sample routes:', sampleRoutes);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        mongoose.connection.close();
    }
}

listCollections();
