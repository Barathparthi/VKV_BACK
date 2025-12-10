const mongoose = require('mongoose');
require('dotenv').config();

async function debugSchema() {
  try {
    console.log('Connecting to DB:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected');

    // Access collection directly to bypass Mongoose schema strictness
    const collection = mongoose.connection.collection('Route-price');
    const items = await collection.find({}).limit(3).toArray();

    console.log('\n--- Raw Data from MongoDB (Route-price) ---');
    console.log(JSON.stringify(items, null, 2));

    console.log('\n--- Checking Mongoose Model ---');
    const RoutePrice = require('./src/models/RoutePrice');
    const mongooseItems = await RoutePrice.find({}).limit(3);
    console.log(JSON.stringify(mongooseItems, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

debugSchema();
