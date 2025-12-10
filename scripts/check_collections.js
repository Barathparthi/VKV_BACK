const mongoose = require('mongoose');
require('dotenv').config();

const checkCollections = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:');

        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count} documents`);

            // If it's the expected new collection, print a sample
            if (col.name === 'attenders' || col.name === 'attenders_data' || col.name === 'attender_datas') {
                const sample = await mongoose.connection.db.collection(col.name).findOne();
                console.log(`  Sample from ${col.name}:`, sample);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkCollections();
