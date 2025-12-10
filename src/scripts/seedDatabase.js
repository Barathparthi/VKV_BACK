// backend/scripts/seedDatabase.js
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Import existing data
const driversData = [
  { id: 1, name: 'SASIKUMAR Dvk', phone: '7502795662', licenseNo: '202523FF65 45TY67807' },
  { id: 2, name: 'VELMURUGAN', phone: '8667459060', licenseNo: '202534GY678 34GY67801' },
  { id: 3, name: 'DHURGESH', phone: '9360252782', licenseNo: '20252014001 1201 0037115' },
  // Add more drivers as needed...
];

const attendersData = [
  { id: 1, name: 'KUMAR A', phone: '9876543210', employeeNo: 'ATD001' },
  { id: 2, name: 'RAVI S', phone: '9876543211', employeeNo: 'ATD002' },
  { id: 3, name: 'SURESH M', phone: '9876543212', employeeNo: 'ATD003' },
  // Add more attenders as needed...
];

async function seedDatabase() {
  console.log('Starting database seeding...');

  const defaultPassword = '1234';
  const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

  // Seed drivers
  console.log('Seeding drivers...');
  for (const driver of driversData) {
    try {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR IGNORE INTO users (name, phone, password, role, license_no)
                     VALUES (?, ?, ?, ?, ?)`,
          [driver.name, driver.phone, hashedPassword, 'driver', driver.licenseNo],
          (err) => {
            if (err) reject(err);
            else resolve();
          },
        );
      });
      console.log(`✓ Added driver: ${driver.name}`);
    } catch (err) {
      console.error(`✗ Error adding driver ${driver.name}:`, err.message);
    }
  }

  // Seed attenders
  console.log('\nSeeding attenders...');
  for (const attender of attendersData) {
    try {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR IGNORE INTO users (name, phone, password, role, employee_no)
                     VALUES (?, ?, ?, ?, ?)`,
          [attender.name, attender.phone, hashedPassword, 'attender', attender.employeeNo],
          (err) => {
            if (err) reject(err);
            else resolve();
          },
        );
      });
      console.log(`✓ Added attender: ${attender.name}`);
    } catch (err) {
      console.error(`✗ Error adding attender ${attender.name}:`, err.message);
    }
  }

  console.log('\n✅ Database seeding completed!');
  console.log(`\nDefault password for all users: ${defaultPassword}`);
  console.log('Admin credentials: admin / admin123\n');

  db.close();
}

// Run seeding
seedDatabase().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
