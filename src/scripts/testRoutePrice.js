// Test script to verify Route Price functionality
require('dotenv').config();
const mongoose = require('mongoose');
const RoutePrice = require('../models/RoutePrice');

async function testRoutePrice() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB\n');

    // Test 1: Check if Route-price collection exists and has data
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 1: Checking Route-price Collection');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const allPrices = await RoutePrice.find({});
    console.log(`📊 Total route prices in database: ${allPrices.length}\n`);

    if (allPrices.length === 0) {
      console.log('⚠️  WARNING: No route prices found in database!');
      console.log('   Run: node backend/scripts/seedRoutePrices.js\n');
    } else {
      console.log('Route Prices:');
      allPrices.forEach((price, index) => {
        console.log(`\n${index + 1}. ${price.from_location} → ${price.to_location}`);
        console.log(`   Driver Bata (Single): ₹${price.driver_bata_single}`);
        console.log(`   Driver Bata (Double): ₹${price.driver_bata_double}`);
        console.log(`   Cleaner Bata: ₹${price.cleaner_bata}`);
      });
    }

    // Test 2: Test case-insensitive search (as used in API)
    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 2: Case-Insensitive Search Test');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (allPrices.length > 0) {
      const testRoute = allPrices[0];
      const testCases = [
        { from: testRoute.from_location, to: testRoute.to_location },
        { from: testRoute.from_location.toLowerCase(), to: testRoute.to_location.toLowerCase() },
        { from: testRoute.from_location.toUpperCase(), to: testRoute.to_location.toUpperCase() },
      ];

      for (const testCase of testCases) {
        const result = await RoutePrice.findOne({
          from_location: { $regex: new RegExp(`^${testCase.from}$`, 'i') },
          to_location: { $regex: new RegExp(`^${testCase.to}$`, 'i') },
        });

        console.log(`Testing: "${testCase.from}" → "${testCase.to}"`);
        console.log(`Result: ${result ? '✅ Found' : '❌ Not Found'}`);
        if (result) {
          console.log(
            `   Driver Single: ₹${result.driver_bata_single}, Double: ₹${result.driver_bata_double}, Cleaner: ₹${result.cleaner_bata}`,
          );
        }
        console.log('');
      }
    }

    // Test 3: Check Routes collection for locations
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 3: Checking Routes Collection (for locations)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const cities = await mongoose.connection.db
      .collection('Routes')
      .find()
      .sort({ City: 1 })
      .toArray();
    console.log(`📍 Total cities in Routes collection: ${cities.length}`);
    if (cities.length > 0) {
      console.log('Cities:', cities.map((c) => c.City).join(', '));
    } else {
      console.log('⚠️  WARNING: No cities found in Routes collection!');
    }

    // Test 4: Verify data consistency
    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 4: Data Consistency Check');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const invalidPrices = allPrices.filter(
      (p) => !p.driver_bata_single || !p.driver_bata_double || !p.cleaner_bata,
    );

    if (invalidPrices.length > 0) {
      console.log(`⚠️  Found ${invalidPrices.length} routes with missing bata values:`);
      invalidPrices.forEach((p) => {
        console.log(`   ${p.from_location} → ${p.to_location}`);
      });
    } else {
      console.log('✅ All route prices have complete bata values');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ TEST COMPLETED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during testing:', error);
    process.exit(1);
  }
}

testRoutePrice();
