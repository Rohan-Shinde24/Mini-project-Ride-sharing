const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Ride = require('./models/Ride');

dotenv.config({ path: './server/.env' });

const addSangliRides = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get some existing users to be hosts
    const hosts = await User.find({ phone: { $exists: true, $ne: null } }).limit(50);
    
    if (hosts.length === 0) {
        console.log('No hosts found.');
        process.exit(1);
    }

    const rides = [];
    const now = new Date();
    const CITIES = ['Pune', 'Mumbai', 'Kolhapur', 'Solapur', 'Satara', 'Karad'];

    for (let i = 0; i < 50; i++) {
      const host = hosts[i % hosts.length];
      const isFromSangli = Math.random() > 0.5;
      const from = isFromSangli ? 'Sangli' : CITIES[Math.floor(Math.random() * CITIES.length)];
      const to = isFromSangli ? CITIES[Math.floor(Math.random() * CITIES.length)] : 'Sangli';

      const daysAhead = Math.floor(Math.random() * 30) + 1;
      const rideDate = new Date(now);
      rideDate.setDate(rideDate.getDate() + daysAhead);

      rides.push({
        host: host._id,
        from,
        to,
        date: rideDate,
        time: `${Math.floor(Math.random() * 16) + 6}:00`,
        price: Math.floor(Math.random() * 500) + 200,
        seats: 4,
        seatsAvailable: 4,
        phone: host.phone,
        description: `Trip ${from} to ${to}`,
        carModel: 'Maruti Swift',
        carType: '4-seater'
      });
    }

    await Ride.insertMany(rides);
    console.log(`Added ${rides.length} rides involving Sangli.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addSangliRides();
