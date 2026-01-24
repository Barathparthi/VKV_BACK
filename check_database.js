const mongoose = require('mongoose');
require('module-alias/register');
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vkv-transport';


async function checkDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        console.log('📍 Database:', mongoose.connection.name);

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📚 Collections in database:');
        collections.forEach(col => {
            console.log(`   - ${col.name}`);
        });

        // Check Route-price collection specifically
        const routePriceCollection = mongoose.connection.db.collection('Route-price');
        const count = await routePriceCollection.countDocuments();
        console.log(`\n📊 Route-price collection has ${count} documents`);

        if (count > 0) {
            // Sample a few documents
            const samples = await routePriceCollection.find({}).limit(5).toArray();
            console.log('\n📄 Sample documents:');
            samples.forEach((doc, index) => {
                console.log(`\n${index + 1}. ${doc.from_location} → ${doc.to_location}`);
                console.log(`   Single: ₹${doc.driver_bata_single}, Double: ₹${doc.driver_bata_double}, Attender: ₹${doc.cleaner_bata}`);
            });

            // Check for Chennai → ernakulam specifically
            console.log('\n🔍 Searching for Chennai → ernakulam (case-insensitive):');
            const chennaiErnakulam = await routePriceCollection.find({
                from_location: /^chennai$/i,
                to_location: /^ernakulam$/i
            }).toArray();

            console.log(`   Found ${chennaiErnakulam.length} matches:`);
            chennaiErnakulam.forEach((doc, index) => {
                console.log(`\n   ${index + 1}. ID: ${doc._id}`);
                console.log(`      From: "${doc.from_location}", To: "${doc.to_location}"`);
                console.log(`      Single: ₹${doc.driver_bata_single}, Double: ₹${doc.driver_bata_double}, Attender: ₹${doc.cleaner_bata}`);
            });
        }

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkDatabase();
