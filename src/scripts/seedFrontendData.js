// Seed script to migrate frontend data to MongoDB
require('module-alias/register'); // Register aliases
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('@/models/User');
const Vehicle = require('@/models/Vehicle');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected for seeding'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Drivers data from frontend
const driversData = [
  { id: 1, name: 'SASIKUMAR Dvk', phone: '7502795662', licenseNo: '202523FF65 45TY67807' },
  { id: 2, name: 'VELMURUGAN', phone: '8667459060', licenseNo: '202534GY678 34GY67801' },
  { id: 3, name: 'DHURGESH', phone: '9360252782', licenseNo: '20252014001 1201 0037115' },
  { id: 4, name: 'MAHADEV AN', phone: '6383564082', licenseNo: '2025IIYIIH 098806' },
  { id: 5, name: 'sivasamy', phone: '9444330909', licenseNo: '2025SSD FGGG12' },
  { id: 6, name: 'ANNAMALAI', phone: '9626596574', licenseNo: '2025VDD F B07' },
  { id: 7, name: 'VINCENT', phone: '9442339761', licenseNo: '2025TN72Z19860000528 3090601' },
  { id: 8, name: 'mohan', phone: '9003246420', licenseNo: '2025TN7620030005009 249306' },
  { id: 9, name: 'ABDULLA', phone: '9500816665', licenseNo: '2025TN7620070001336 111821' },
  { id: 10, name: 'RAJA', phone: '9994055569', licenseNo: '202505266 09' },
  { id: 11, name: 'karthik', phone: '9629980563', licenseNo: '2025VGG F B07' },
  { id: 12, name: 'ANBU', phone: '9087003192', licenseNo: '2025888 44411' },
  { id: 13, name: 'PRAVEENKUMAR', phone: '8248835395', licenseNo: '20255555 5264465431' },
  { id: 14, name: 'SUGUMAR', phone: '9841712377', licenseNo: '2025TN31U20000000949 55555555502' },
  { id: 15, name: 'muthuraj', phone: '8667642337', licenseNo: '20255555 655656506' },
  { id: 16, name: 'pechimuthu', phone: '9043368535', licenseNo: '2025455554 44444426' },
  { id: 17, name: 'sridhar', phone: '8610576395', licenseNo: '20256545454 6564502' },
  { id: 18, name: 'GANESHP ANDIAN', phone: '9994553696', licenseNo: '202520070007254 138121' },
  { id: 19, name: 'PY', phone: '9524328879', licenseNo: '202520110003213 0038428' },
  { id: 20, name: 'REDDY', phone: '8122557060', licenseNo: '2025KKKKK 7Q5T29' },
  { id: 21, name: 'GANESHKUMAR', phone: '9003502290', licenseNo: '2025JHSB MNGGA12' },
  { id: 22, name: 'vishnu', phone: '8248057347', licenseNo: '2025LLLLL 111108' },
  { id: 23, name: 'santhanaperumal', phone: '8903590047', licenseNo: '2025000121 000245406' },
  { id: 24, name: 'Saravanamuthukumar', phone: '8668148376', licenseNo: '2025000122 000245401' },
  { id: 25, name: 'RAMRAJ', phone: '9788452293', licenseNo: '2025000126 0001234506' },
  { id: 26, name: 'SAKTHIVEL', phone: '9600492760', licenseNo: '2025000128 0001234505' },
  { id: 27, name: 'ARUMUGAM', phone: '9487419079', licenseNo: '2025000121 000245407' },
  { id: 28, name: 'thirukannan', phone: '9043687436', licenseNo: '2025000121 000245419' },
  { id: 29, name: 'MUTHUKUMARAN', phone: '9626640717', licenseNo: '202500012 0021316' },
  { id: 30, name: 'chinna thambi', phone: '9384047581', licenseNo: '20240052 051431' },
  { id: 31, name: 'alahudeen', phone: '8144678962', licenseNo: '2024TN0919980001292 4079530' },
  {
    id: 32,
    name: 'KADARKARAIMURUGAN',
    phone: '9442822217',
    licenseNo: '2025TN09199800012231 1049601',
  },
  { id: 33, name: 'murugan', phone: '9843091380', licenseNo: '2025TN4822667 8856R10' },
  { id: 34, name: 'krishnaraj', phone: '9025128487', licenseNo: '2025TN0919980001292 20261261425' },
  { id: 35, name: 'Muththaiya', phone: '9940790727', licenseNo: '2025TN482266H7 77665824' },
  { id: 36, name: 'dinakaran', phone: '9578666818', licenseNo: '2025TN0919980001292 4079504' },
  {
    id: 37,
    name: 'krishnamoorthy',
    phone: '9344639356',
    licenseNo: '2025TN09199800012251 40794506',
  },
  { id: 38, name: 'Manimaran', phone: '7418341509', licenseNo: '2025000121 000245404' },
  { id: 39, name: 'santhosh', phone: '7806921407', licenseNo: '2025TN6820150005880 00' },
  { id: 40, name: 'Gunaseelan', phone: '9363251986', licenseNo: '2025TN66300076676 77665825' },
  { id: 41, name: 'Venkat', phone: '9731314777', licenseNo: '2025TN482266H7 77665812' },
  { id: 42, name: 'rajesh', phone: '9994220022', licenseNo: '2025649 98520' },
  { id: 43, name: 'Muthukaruppan', phone: '9385500599', licenseNo: '2025TN6020150001063 0001820' },
  { id: 44, name: 'Govindharaj', phone: '9442712866', licenseNo: '2025TN72Z19860000528 3090630' },
  { id: 45, name: 'Senthil', phone: '9750452041', licenseNo: '2025' },
  { id: 46, name: 'Jameel', phone: '7871278692', licenseNo: '2025649 98516' },
  { id: 47, name: 'Essikamuthu', phone: '9344285156', licenseNo: '20255555 3090603' },
  { id: 48, name: 'sebastian', phone: '7598203187', licenseNo: '20255555 11820' },
  { id: 49, name: 'Arunkumar', phone: '9940307561', licenseNo: '20255555 11802' },
  { id: 50, name: 'Thangarasu', phone: '9943855107', licenseNo: '20255555 11804' },
  { id: 51, name: 'Muthu', phone: '8122923387', licenseNo: '202519980002153 11803' },
  { id: 52, name: 'Sakthikumar', phone: '9514276470', licenseNo: '20255555 11803' },
  {
    id: 53,
    name: 'R.Srinivasan',
    phone: '9360263934',
    licenseNo: '2025TN23 20100007774 000222109',
  },
  { id: 54, name: 'vasanth', phone: '9976676744', licenseNo: '20252586698 22858510' },
  { id: 55, name: 'pandian', phone: '9655690678', licenseNo: '20255485554 218954511' },
  { id: 56, name: 'Arumugam K', phone: '9940412576', licenseNo: '258969422 25899701' },
  { id: 57, name: 'dass', phone: '9176636392', licenseNo: '202533359 8496201' },
  { id: 58, name: 'nagaraj', phone: '9787125916', licenseNo: '202521002 0124520' },
  { id: 59, name: 'bhau bhor', phone: '8108129954', licenseNo: '2025222 33307' },
  { id: 60, name: 'RAHUL', phone: '9944799053', licenseNo: '2025FE6236289064H 18941519831' },
  { id: 61, name: 'COMBAIY A', phone: '9952216007', licenseNo: '2025453456832 4534516' },
];

// Attenders data from frontend
const attendersData = [
  { id: 1, name: 'KUMAR A', phone: '9876543210', employeeNo: 'ATD001' },
  { id: 2, name: 'RAVI S', phone: '9876543211', employeeNo: 'ATD002' },
  { id: 3, name: 'SURESH M', phone: '9876543212', employeeNo: 'ATD003' },
  { id: 4, name: 'PRAKASH K', phone: '9876543213', employeeNo: 'ATD004' },
  { id: 5, name: 'VIJAY R', phone: '9876543214', employeeNo: 'ATD005' },
  { id: 6, name: 'ARUN P', phone: '9876543215', employeeNo: 'ATD006' },
  { id: 7, name: 'BALA N', phone: '9876543216', employeeNo: 'ATD007' },
  { id: 8, name: 'DINESH T', phone: '9876543217', employeeNo: 'ATD008' },
  { id: 9, name: 'GANESH V', phone: '9876543218', employeeNo: 'ATD009' },
  { id: 10, name: 'HARI K', phone: '9876543219', employeeNo: 'ATD010' },
  { id: 11, name: 'KARTHIK S', phone: '9876543220', employeeNo: 'ATD011' },
  { id: 12, name: 'MANOJ R', phone: '9876543221', employeeNo: 'ATD012' },
  { id: 13, name: 'NAVEEN M', phone: '9876543222', employeeNo: 'ATD013' },
  { id: 14, name: 'PRABHU K', phone: '9876543223', employeeNo: 'ATD014' },
  { id: 15, name: 'RAJESH P', phone: '9876543224', employeeNo: 'ATD015' },
  { id: 16, name: 'SANJAY T', phone: '9876543225', employeeNo: 'ATD016' },
  { id: 17, name: 'TAMIL V', phone: '9876543226', employeeNo: 'ATD017' },
  { id: 18, name: 'UDHAY N', phone: '9876543227', employeeNo: 'ATD018' },
  { id: 19, name: 'VIMAL S', phone: '9876543228', employeeNo: 'ATD019' },
  { id: 20, name: 'YOGESH R', phone: '9876543229', employeeNo: 'ATD020' },
];

// Vehicles data from frontend
const vehiclesData = [
  { id: 1, vehicle_number: 'NL01B9051', bus_type: 'Bus', status: 'Active' },
  { id: 2, vehicle_number: 'TN18BU9046', bus_type: 'Bus', status: 'Active' },
  { id: 3, vehicle_number: 'TN18BS9036', bus_type: 'Sleeper', status: 'Active' },
  { id: 4, vehicle_number: 'TN05CB5130', bus_type: 'Sleeper', status: 'Active' },
  { id: 5, vehicle_number: 'TN18BC9003', bus_type: 'Bus', status: 'Active' },
  { id: 6, vehicle_number: 'TN18BC9002', bus_type: 'Bus', status: 'Active' },
  { id: 7, vehicle_number: 'TN18BC9005', bus_type: 'Sleeper', status: 'Active' },
  { id: 8, vehicle_number: 'TN18BJ9011', bus_type: 'Sleeper', status: 'Active' },
  { id: 9, vehicle_number: 'TN18BJ9010', bus_type: 'Sleeper', status: 'Active' },
  { id: 10, vehicle_number: 'NL01B9008', bus_type: 'Sleeper', status: 'Active' },
  { id: 11, vehicle_number: 'NL01B9009', bus_type: 'Sleeper', status: 'Active' },
  { id: 12, vehicle_number: 'TN18BL6001', bus_type: 'Sleeper', status: 'Active' },
  { id: 13, vehicle_number: 'TN18BL6002', bus_type: 'Bus', status: 'Active' },
  { id: 14, vehicle_number: 'TN18BL9012', bus_type: 'Sleeper', status: 'Active' },
  { id: 15, vehicle_number: 'TN18BL9013', bus_type: 'Bus', status: 'Active' },
  { id: 16, vehicle_number: 'TN18BM9014', bus_type: 'Sleeper', status: 'Active' },
  { id: 17, vehicle_number: 'TN18BM9015', bus_type: 'Sleeper', status: 'Active' },
  { id: 18, vehicle_number: 'TN18BM9016', bus_type: 'Sleeper', status: 'Active' },
  { id: 19, vehicle_number: 'TN18BM9017', bus_type: 'Sleeper', status: 'Active' },
  { id: 20, vehicle_number: 'TN18BP9021', bus_type: 'Sleeper', status: 'Active' },
  { id: 21, vehicle_number: 'TN18BP9020', bus_type: 'Sleeper', status: 'Active' },
  { id: 22, vehicle_number: 'TN18BQ9022', bus_type: 'Sleeper', status: 'Active' },
  { id: 23, vehicle_number: 'TN18BQ9023', bus_type: 'Sleeper', status: 'Active' },
  { id: 24, vehicle_number: 'TN18BQ9024', bus_type: 'Sleeper', status: 'Active' },
  { id: 25, vehicle_number: 'TN18BQ9025', bus_type: 'Sleeper', status: 'Active' },
  { id: 26, vehicle_number: 'TN18BP9026', bus_type: 'Bus', status: 'Active' },
  { id: 27, vehicle_number: 'TN18BQ9027', bus_type: 'Bus', status: 'Active' },
  { id: 28, vehicle_number: 'TN18BQ9028', bus_type: 'Bus', status: 'Active' },
  { id: 29, vehicle_number: 'NL01B9000', bus_type: 'Sleeper', status: 'Active' },
  { id: 30, vehicle_number: 'NL01B9001', bus_type: 'Bus', status: 'Active' },
];

const seedDatabase = async () => {
  try {
    console.log('\n🔄 Starting database seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({ role: { $in: ['driver', 'attender'] } });
    await Vehicle.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Seed Drivers
    console.log('👤 Seeding drivers...');
    const driverPromises = driversData.map(async (driver, index) => {
      try {
        return await User.create({
          name: driver.name,
          phone: driver.phone,
          password: '1234', // Default password for all drivers
          role: 'driver',
          employeeCode: `DRV${String(index + 1).padStart(3, '0')}`,
          licenseNo: driver.licenseNo,
          isActive: true,
        });
      } catch (err) {
        console.error(`  ❌ Error creating driver ${driver.name}:`, err.message);
        return null;
      }
    });

    const drivers = await Promise.all(driverPromises);
    const successfulDrivers = drivers.filter((d) => d !== null);
    console.log(`✅ Created ${successfulDrivers.length} drivers\n`);

    // Seed Attenders
    console.log('👥 Seeding attenders...');
    const attenderPromises = attendersData.map(async (attender) => {
      try {
        return await User.create({
          name: attender.name,
          phone: attender.phone,
          password: '1234', // Default password for all attenders
          role: 'attender',
          employeeCode: attender.employeeNo,
          isActive: true,
        });
      } catch (err) {
        console.error(`  ❌ Error creating attender ${attender.name}:`, err.message);
        return null;
      }
    });

    const attenders = await Promise.all(attenderPromises);
    const successfulAttenders = attenders.filter((a) => a !== null);
    console.log(`✅ Created ${successfulAttenders.length} attenders\n`);

    // Seed Vehicles
    console.log('🚌 Seeding vehicles...');
    const vehiclePromises = vehiclesData.map(async (vehicle) => {
      try {
        // Map bus_type to match the enum in Vehicle model
        let bus_type = 'SEATER';
        if (vehicle.bus_type.toLowerCase().includes('sleeper')) {
          bus_type = 'SLEEPER';
        } else if (vehicle.bus_type.toLowerCase().includes('ac')) {
          bus_type = 'AC';
        }

        // Set default capacity based on bus type
        const capacity = bus_type === 'SLEEPER' ? 40 : 50;
        const default_mileage = 8; // 8 km/liter as default

        return await Vehicle.create({
          vehicle_number: vehicle.vehicle_number,
          bus_type: bus_type,
          default_mileage: default_mileage,
          capacity: capacity,
          status: vehicle.status.toLowerCase(),
        });
      } catch (err) {
        console.error(`  ❌ Error creating vehicle ${vehicle.vehicle_number}:`, err.message);
        return null;
      }
    });

    const vehicles = await Promise.all(vehiclePromises);
    const successfulVehicles = vehicles.filter((v) => v !== null);
    console.log(`✅ Created ${successfulVehicles.length} vehicles\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ DATABASE SEEDING COMPLETED!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Summary:`);
    console.log(`   Drivers:   ${successfulDrivers.length}/${driversData.length}`);
    console.log(`   Attenders: ${successfulAttenders.length}/${attendersData.length}`);
    console.log(`   Vehicles:  ${successfulVehicles.length}/${vehiclesData.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Default password for all users: 1234');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed\n');
    process.exit(0);
  }
};

// Run the seeding
seedDatabase();
