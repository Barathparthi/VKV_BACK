const mongoose = require('mongoose');
require('dotenv').config();
const RoutePrice = require('./src/models/RoutePrice');

async function checkBangalore() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected');

    const bangalore = await RoutePrice.findOne({
      $or: [
        { from_location: /Bangalore/i },
        { to_location: /Bangalore/i },
        { From: /Bangalore/i }, // Check for bad schema keys too
      ],
    });

    if (bangalore) {
      console.log('⚠️ Found Bangalore in Route-price:', bangalore);
    } else {
      console.log('✅ No Bangalore found in Route-price.');
    }

    const allLocations = await RoutePrice.find({}, 'from_location to_location From To');
    console.log(`Total docs: ${allLocations.length}`);

    const locations = new Set();
    allLocations.forEach((doc) => {
      // Check both schema fields and potential bad fields
      if (doc.from_location) locations.add(doc.from_location);
      if (doc.to_location) locations.add(doc.to_location);
      if (doc.get('From')) locations.add(doc.get('From')); // Access fields not in schema
      if (doc.get('To')) locations.add(doc.get('To'));
    });

    console.log('Unique locations in Route-price:', Array.from(locations).sort());
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

checkBangalore();
