const mongoose = require('mongoose');
const User = require('../models/User');
const argon2 = require('argon2');
require('dotenv').config();
const connectDB = require('../config/db');

const createSpecificAdmin = async () => {
  try {
    await connectDB();

    const email = 'admin@gmail.com';
    const password = 'admin@123';
    const name = 'Super Admin'; // Placeholder name
    const role = 'admin';

    let user = await User.findOne({ email });

    const hashedPassword = await argon2.hash(password);

    if (user) {
      user.password = hashedPassword;
      user.role = role;
      user.isDeleted = false; // Ensure not soft deleted
      await user.save();
      console.log(`User ${email} updated to admin with new password.`);
    } else {
      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        isDeleted: false
      });
      await user.save();
      console.log(`New admin user ${email} created.`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createSpecificAdmin();
