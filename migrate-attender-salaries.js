/**
 * Migration Script: Populate Attender Salary Fields
 * 
 * This script updates existing trips that have attenders to populate
 * the new attender-specific salary fields (attender_base_salary, etc.)
 * 
 * Run this once after deploying the new attender salary fields changes.
 */

const mongoose = require('mongoose');
const Trip = require('./src/models/Trip');
require('dotenv').config();

const migrateAttenderSalaries = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✓ Connected to MongoDB');

        // Find all trips that have an attender but don't have attender_base_salary set
        const tripsWithAttenders = await Trip.find({
            attender1Id: { $ne: null },
            $or: [
                { attender_base_salary: { $exists: false } },
                { attender_base_salary: 0 }
            ]
        });

        console.log(`\nFound ${tripsWithAttenders.length} trips with attenders that need migration`);

        if (tripsWithAttenders.length === 0) {
            console.log('No trips to migrate. Exiting...');
            process.exit(0);
        }

        let updated = 0;
        let failed = 0;

        for (const trip of tripsWithAttenders) {
            try {
                // Simply save the trip - the pre-save hook will calculate attender salary fields
                await trip.save();
                updated++;

                if (updated % 10 === 0) {
                    console.log(`Progress: ${updated}/${tripsWithAttenders.length} trips updated`);
                }
            } catch (error) {
                console.error(`Failed to update trip ${trip._id}:`, error.message);
                failed++;
            }
        }

        console.log('\n=== Migration Complete ===');
        console.log(`✓ Successfully updated: ${updated} trips`);
        if (failed > 0) {
            console.log(`✗ Failed to update: ${failed} trips`);
        }
        console.log('==========================\n');

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

// Run migration
console.log('\n=== Starting Attender Salary Migration ===\n');
migrateAttenderSalaries();
