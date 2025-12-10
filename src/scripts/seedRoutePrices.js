// Seed script to populate Route Prices
require('dotenv').config();
const mongoose = require('mongoose');
const RoutePrice = require('../models/RoutePrice');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected for seeding route prices'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const routePricesData = [
  {
    from_location: 'Chennai',
    to_location: 'Bangalore',
    driver_bata_single: 500,
    driver_bata_double: 900,
    cleaner_bata: 300,
  },
  {
    from_location: 'Coimbatore',
    to_location: 'Madurai',
    driver_bata_single: 400,
    driver_bata_double: 750,
    cleaner_bata: 250,
  },
  {
    from_location: 'Trichy',
    to_location: 'Salem',
    driver_bata_single: 300,
    driver_bata_double: 550,
    cleaner_bata: 200,
  },
  {
    from_location: 'Madurai',
    to_location: 'Chennai',
    driver_bata_single: 600,
    driver_bata_double: 1100,
    cleaner_bata: 400,
  },
];

const seedRoutePrices = async () => {
  try {
    console.log('\n🔄 Starting Route Price seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing route prices...');
    await RoutePrice.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Seed Route Prices
    console.log('🛣️  Seeding route prices...');
    const pricePromises = routePricesData.map(async (price) => {
      try {
        return await RoutePrice.create(price);
      } catch (err) {
        console.error(
          `  ❌ Error creating price for ${price.from_location} -> ${price.to_location}:`,
          err.message,
        );
        return null;
      }
    });

    const prices = await Promise.all(pricePromises);
    const successfulPrices = prices.filter((p) => p !== null);
    console.log(`✅ Created ${successfulPrices.length} route prices\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ ROUTE PRICE SEEDING COMPLETED!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed\n');
    process.exit(0);
  }
};

seedRoutePrices();
