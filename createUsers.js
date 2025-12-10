// const mongoose = require("mongoose");
// const { User } = require('./models/User');

// mongoose.connect("mongodb://localhost:27017/VKV")
//     .then(async () => {
//         console.log("Connected to Mongo");

//         await User.deleteMany(); // optional clean

//         await User.create([
//             {
//                 name: "Driver One",
//                 phone: "7502795662",
//                 password: "1234",
//                 role: "driver",
//                 employeeCode: "DR001"
//             },
//             {
//                 name: "Attender One",
//                 phone: "9876543210",
//                 password: "1234",
//                 role: "attender",
//                 employeeCode: "AT001"
//             },
//             {
//                 name: "Admin User",
//                 phone: "admin",
//                 password: "admin123",
//                 role: "admin"
//             }
//         ]);

//         console.log("Users created");
//         process.exit();
//     })
//     .catch(err => console.error(err));

const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose
  .connect('mongodb+srv://admin:admin123@cluster0.mp18txy.mongodb.net/vkv')
  .then(() => console.log('Connected to Mongo'))
  .catch((err) => console.log(err));

async function seedUsers() {
  try {
    await User.deleteMany();

    // Create admin
    await User.create({
      name: 'Admin User',
      phone: 'admin',
      password: 'admin123',
      role: 'admin',
      employeeCode: 'ADM001',
    });

    // Create demo driver
    await User.create({
      name: 'Demo Driver',
      phone: '7502795662',
      password: '1234',
      role: 'driver',
      employeeCode: 'DRV001',
    });

    // Create demo attender
    await User.create({
      name: 'Demo Attender',
      phone: '9876543210',
      password: '1234',
      role: 'attender',
      employeeCode: 'ATT001',
    });

    console.log('Users created successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedUsers();
