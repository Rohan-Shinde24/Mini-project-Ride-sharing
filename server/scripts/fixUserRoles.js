const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();
const connectDB = require('../config/db');

const fixUserRoles = async () => {
  try {
    await connectDB();

    // Update all users where role is NOT 'admin' to have role 'user'
    // This covers users with missing role field or any other value
    const result = await User.updateMany(
      { role: { $ne: 'admin' } },
      { $set: { role: 'user' } }
    );

    console.log(`Updated roles for ${result.modifiedCount} users.`);
    
    // Also ensure isDeleted is set if missing
    const deleteResult = await User.updateMany(
        { isDeleted: { $exists: false } },
        { $set: { isDeleted: false } }
    );
    console.log(`Initialized isDeleted for ${deleteResult.modifiedCount} users.`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixUserRoles();
