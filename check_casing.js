const mongoose = require('mongoose');
require('module-alias/register');
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vkv-transport';

async function checkExactCasing() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const routePriceCollection = mongoose.connection.db.collection('Route-price');

        // Check exact casing variations
        console.log('🔍 Checking exact casing for Chennai → ernakulam/Ernakulam:\n');

        const variations = [
            { from: 'Chennai', to: 'ernakulam' },
            { from: 'Chennai', to: 'Ernakulam' },
            { from: 'chennai', to: 'ernakulam' },
            { from: 'chennai', to: 'Ernakulam' },
        ];

        for (const variant of variations) {
            const route = await routePriceCollection.findOne({
                from_location: variant.from,
                to_location: variant.to
            });

            if (route) {
                console.log(`✅ Found: "${variant.from}" → "${variant.to}"`);
                console.log(`   ID: ${route._id}`);
                console.log(`   Single: ₹${route.driver_bata_single}, Double: ₹${route.driver_bata_double}, Attender: ₹${route.cleaner_bata}\n`);
            } else {
                console.log(`❌ Not found: "${variant.from}" → "${variant.to}"\n`);
            }
        }

        // Now test the regex search (what the API uses)
        console.log('\n🔍 Testing regex search (case-insensitive) for "Chennai" → "ernakulam":\n');

        const regexResult = await routePriceCollection.findOne({
            from_location: { $regex: new RegExp(`^Chennai$`, 'i') },
            to_location: { $regex: new RegExp(`^ernakulam$`, 'i') }
        });

        if (regexResult) {
            console.log(`✅ Regex found: "${regexResult.from_location}" → "${regexResult.to_location}"`);
            console.log(`   ID: ${regexResult._id}`);
            console.log(`   Single: ₹${regexResult.driver_bata_single}, Double: ₹${regexResult.driver_bata_double}, Attender: ₹${regexResult.cleaner_bata}`);
        } else {
            console.log(`❌ Regex search found nothing`);
        }

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkExactCasing();
