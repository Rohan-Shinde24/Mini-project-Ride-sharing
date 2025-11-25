const mongoose = require('mongoose');
const Ride = require('./models/Ride');
const User = require('./models/User');
const argon2 = require('argon2');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding');

    // Create a demo host user if not exists
    let host = await User.findOne({ email: 'driver@example.com' });
    if (!host) {
      const hashedPassword = await argon2.hash('password123');
      host = new User({
        name: 'Rahul Driver',
        email: 'driver@example.com',
        password: hashedPassword
      });
      await host.save();
      console.log('Demo host created');
    }

    // Clear existing rides (optional, but good for clean slate if desired. 
    // User asked to "insert", so maybe just append? 
    // Let's append to avoid deleting user's created data if any, 
    // but for "insert 20 ride" usually implies having a good set.)
    // I will just insert.

    const cities = ['Mumbai', 'Pune', 'Sangli', 'Nashik', 'Nagpur', 'Aurangabad', 'Surat', 'Ahmedabad', 'Vadodara', 'Rajkot'];
    
    const rides = [];
    for (let i = 0; i < 20; i++) {
      const from = cities[Math.floor(Math.random() * cities.length)];
      let to = cities[Math.floor(Math.random() * cities.length)];
      while (to === from) {
        to = cities[Math.floor(Math.random() * cities.length)];
      }

      // Random date within next 7 days
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 7));
      
      rides.push({
        host: host._id,
        from: from,
        to: to,
        date: date,
        time: `${Math.floor(Math.random() * 12) + 6}:00`, // 6 AM to 6 PM
        price: Math.floor(Math.random() * 500) + 200, // 200 - 700 INR
        seats: 3,
        seatsAvailable: 3,
        description: `Trip from ${from} to ${to}. Comfortable ride.`
      });
    }

    await Ride.insertMany(rides);
    console.log('20 Rides inserted successfully');

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
