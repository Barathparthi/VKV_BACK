const mongoose = require('mongoose');
require('dotenv').config();
const RoutePrice = require('./src/models/RoutePrice');

async function cleanData() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected');

    // 1. Delete documents that don't have 'from_location' (the bad imports)
    const result = await RoutePrice.deleteMany({ from_location: { $exists: false } });
    console.log(`🗑️ Deleted ${result.deletedCount} bad documents (missing from_location)`);

    // 2. Delete documents that have 'From' field (just to be safe)
    // Note: Mongoose might not let us query fields not in schema easily with deleteMany unless we use the native driver or strict: false
    // But the above check { from_location: { $exists: false } } should catch them since the bad ones have 'From' but not 'from_location'.

    // 3. Verify what's left
    const remaining = await RoutePrice.countDocuments();
    console.log(`✅ Remaining valid documents: ${remaining}`);

    const sample = await RoutePrice.findOne({});
    console.log('Sample valid document:', sample);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

cleanData();
