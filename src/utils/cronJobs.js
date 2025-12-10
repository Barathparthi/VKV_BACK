const cron = require('node-cron');
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5001';

/**
 * Background job to check and convert expired double trips to single
 * Runs every 15 minutes
 */
const startDoubleTripConversionJob = () => {
    // Run every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
        try {
            console.log(`[${new Date().toISOString()}] Running double trip conversion job...`);

            const response = await axios.get(`${API_URL}/trips/check-expired`);

            if (response.data.convertedCount > 0) {
                console.log(`✅ Converted ${response.data.convertedCount} expired double trips to single`);
            } else {
                console.log('✓ No expired trips to convert');
            }
        } catch (error) {
            console.error('❌ Error in double trip conversion job:', error.message);
        }
    });

    console.log('🕒 Double trip conversion job scheduled (runs every 15 minutes)');
};

/**
 * Daily cleanup job to reset for new day
 * Runs at midnight (00:00) every day
 */
const startDailyCleanupJob = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log(`[${new Date().toISOString()}] Running daily cleanup job...`);

            // Convert any remaining expired trips from previous day
            const response = await axios.get(`${API_URL}/trips/check-expired`);

            console.log(`✅ Daily cleanup completed. Converted ${response.data.convertedCount} trips`);
        } catch (error) {
            console.error('❌ Error in daily cleanup job:', error.message);
        }
    });

    console.log('🌙 Daily cleanup job scheduled (runs at midnight)');
};

module.exports = {
    startDoubleTripConversionJob,
    startDailyCleanupJob
};
