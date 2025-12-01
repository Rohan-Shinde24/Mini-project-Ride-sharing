const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Ride = require('./models/Ride');
const Request = require('./models/Request');

dotenv.config({ path: './server/.env' });

const cleanupData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Deleting all Requests...');
    const requestResult = await Request.deleteMany({});
    console.log(`Deleted ${requestResult.deletedCount} requests.`);

    console.log('Deleting all Rides...');
    const rideResult = await Ride.deleteMany({});
    console.log(`Deleted ${rideResult.deletedCount} rides.`);

    console.log('Deleting all Users (except admins)...');
    const userResult = await User.deleteMany({ role: { $ne: 'admin' } });
    console.log(`Deleted ${userResult.deletedCount} users.`);

    console.log('Cleanup Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning up data:', error);
    process.exit(1);
  }
};

cleanupData();
