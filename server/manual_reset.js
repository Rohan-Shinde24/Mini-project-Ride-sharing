const mongoose = require('mongoose');
const argon2 = require('argon2');
const User = require('./models/User');
require('dotenv').config();

const resetPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const email = 'rohan42455@gmail.com';
    const newPassword = 'Rohan@009008';

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await argon2.hash(newPassword);
    
    // Update user
    user.password = hashedPassword;
    await user.save();

    console.log(`Password for ${email} has been successfully updated.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPassword();
