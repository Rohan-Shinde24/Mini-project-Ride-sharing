const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();
const connectDB = require('../config/db');

const promoteFirstUser = async () => {
  try {
    await connectDB();

    const user = await User.findOne({ email: 'rohan@gmail.com' });

    if (!user) {
      console.log('User rohan@gmail.com not found.');
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`User ${user.email} promoted to admin.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

promoteFirstUser();
