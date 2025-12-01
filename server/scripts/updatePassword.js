const mongoose = require('mongoose');
const User = require('../models/User');
const argon2 = require('argon2');
require('dotenv').config();
const connectDB = require('../config/db');

const updateUserPassword = async () => {
  try {
    await connectDB();

    const email = 'rohan@gmail.com';
    const newPassword = 'Rohan@009008';

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User ${email} not found.`);
      process.exit(1);
    }

    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;
    await user.save();

    console.log(`Password for user ${email} updated successfully.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updateUserPassword();
