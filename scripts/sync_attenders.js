const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const syncAttenders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const attendersCollection = mongoose.connection.db.collection('attenders_data');
        const attenders = await attendersCollection.find({}).toArray();

        console.log(`Found ${attenders.length} attenders in attenders_data`);

        let created = 0;
        let updated = 0;

        for (const attender of attenders) {
            const phoneStr = attender.phone.toString();

            const userData = {
                name: attender.name,
                phone: phoneStr,
                employeeNo: attender.employeeNo,
                employeeCode: attender.employeeNo, // Sync to employeeCode as well
                role: 'attender',
                // Default password if creating new
                password: '1234',
                isActive: true
            };

            // Check if user exists
            const existingUser = await User.findOne({ phone: phoneStr });

            if (existingUser) {
                // Update
                existingUser.name = userData.name;
                existingUser.employeeNo = userData.employeeNo;
                existingUser.employeeCode = userData.employeeCode;
                existingUser.role = 'attender'; // Ensure role is set
                await existingUser.save();
                updated++;
            } else {
                // Create
                await User.create(userData);
                created++;
            }
        }

        console.log(`Sync complete. Created: ${created}, Updated: ${updated}`);
        process.exit(0);
    } catch (error) {
        console.error('Error syncing attenders:', error);
        process.exit(1);
    }
};

syncAttenders();
