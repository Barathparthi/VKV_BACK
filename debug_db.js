const mongoose = require('mongoose');
require('dotenv').config();
const RoutePrice = require('./src/models/RoutePrice');
const Route = require('./src/models/Route');

async function debugDb() {
  try {
    console.log('Connecting to DB:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected');

    const routeCount = await Route.countDocuments();
    console.log(`\nRoute Collection Count: ${routeCount}`);
    const routes = await Route.find({}).limit(5);
    console.log(
      'Sample Routes:',
      routes.map((r) => r.from_location),
    );

    const priceCount = await RoutePrice.countDocuments();
    console.log(`\nRoute-price Collection Count: ${priceCount}`);
    const prices = await RoutePrice.find({}).limit(5);
    console.log(
      'Sample Prices:',
      prices.map((p) => p.from_location),
    );

    if (priceCount === 0) {
      console.log('\n⚠️ Route-price collection is EMPTY in this database!');
      console.log('Please check if you imported the data into the correct database.');
    } else {
      console.log('\n✅ Route-price collection has data.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

debugDb();
