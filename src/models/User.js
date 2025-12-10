// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Name is required']
//     },
//     phone: {
//         type: String,
//         required: [true, 'Phone number is required'],
//         unique: true,
//         match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number']
//     },
//     password: {
//         type: String,
//         required: [true, 'Password is required'],
//         minlength: 4,
//         select: false
//     },
//     role: {
//         type: String,
//         enum: ['driver', 'attender', 'admin'],
//         default: 'driver'
//     },
//     employeeCode: {
//         type: String,
//         unique: true
//     },
//     isActive: {
//         type: Boolean,
//         default: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// }, {
//     discriminatorKey: 'role',
//     timestamps: true
// });

// // Encrypt password using bcrypt
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

// // Match user entered password to hashed password in database
// userSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model('User', userSchema);

// // Driver Schema (extends User)
// const driverSchema = new mongoose.Schema({
//     licenseNo: {
//         type: String,
//         required: [true, 'License number is required']
//     },
//     address: String,
//     emergencyContact: String,
//     salaryRate: {
//         type: Number,
//         default: 0
//     },
//     joiningDate: {
//         type: Date,
//         default: Date.now
//     }
// });

// const Driver = User.discriminator('driver', driverSchema);

// // Attender Schema (extends User)
// const attenderSchema = new mongoose.Schema({
//     address: String,
//     emergencyContact: String,
//     salaryRate: {
//         type: Number,
//         default: 0
//     },
//     joiningDate: {
//         type: Date,
//         default: Date.now
//     }
// });

// const Attender = User.discriminator('attender', attenderSchema);

// module.exports = { User, Driver, Attender };



const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^[0-9]{10}$|^admin$/, "Phone must be 10 digits OR 'admin'"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 4,
      select: false,
    },
    role: {
      type: String,
      enum: ["driver", "attender", "admin"],
      default: "driver",
    },
    employeeCode: String,
    employeeNo: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    licenseNo: String,
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password with hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
