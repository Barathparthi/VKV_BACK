// scripts/seedRoutes.js
const mongoose = require('mongoose');
require('dotenv').config();
const Route = require('../models/Route');

const routes = [
  { from_location: 'Bangalore', to_location: 'Mysore', distance: 150 },
  { from_location: 'Bangalore', to_location: 'Chennai', distance: 350 },
  { from_location: 'Bangalore', to_location: 'Hyderabad', distance: 570 },
  { from_location: 'Bangalore', to_location: 'Coimbatore', distance: 370 },
  { from_location: 'Bangalore', to_location: 'Pune', distance: 840 },
  { from_location: 'Bangalore', to_location: 'Mumbai', distance: 980 },
  { from_location: 'Mysore', to_location: 'Chennai', distance: 480 },
  { from_location: 'Mysore', to_location: 'Coimbatore', distance: 250 },
  { from_location: 'Chennai', to_location: 'Hyderabad', distance: 630 },
  { from_location: 'Chennai', to_location: 'Coimbatore', distance: 500 },
  { from_location: 'Hyderabad', to_location: 'Pune', distance: 560 },
  { from_location: 'Hyderabad', to_location: 'Mumbai', distance: 710 },
  { from_location: 'Coimbatore', to_location: 'Pune', distance: 1100 },
  { from_location: 'Pune', to_location: 'Mumbai', distance: 150 },
];

async function seedRoutes() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing routes
    await Route.deleteMany({});
    console.log('🗑️  Cleared existing routes');

    // Insert new routes
    const createdRoutes = await Route.insertMany(routes);
    console.log(`✅ Created ${createdRoutes.length} routes`);

    console.log('\n📍 Sample Routes:');
    createdRoutes.slice(0, 5).forEach((route) => {
      console.log(`   ${route.from_location} → ${route.to_location}: ${route.distance} km`);
    });

    console.log('\n✨ Route seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding routes:', error);
    process.exit(1);
  }
}

seedRoutes();
