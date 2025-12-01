const mongoose = require('mongoose');
const dotenv = require('dotenv');
const argon2 = require('argon2');
const User = require('./models/User');
const Ride = require('./models/Ride');

dotenv.config({ path: './server/.env' });

const INDIAN_CITIES = [
  'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane', 'Solapur', 'Kolhapur',
  'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Jaipur',
  'Lucknow', 'Kanpur', 'Indore', 'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Varanasi', 'Visakhapatnam', 'Coimbatore', 'Kochi', 'Madurai', 'Mysore',
  'Chandigarh', 'Guwahati', 'Bhubaneswar', 'Raipur', 'Ranchi', 'Jodhpur', 'Udaipur'
];

const FIRST_NAMES = [
  'Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya',
  'Rohan', 'Atharva', 'Kabir', 'Aryan', 'Vivaan', 'Dhruv', 'Ansh', 'Aarush', 'Rudran', 'Om',
  'Ananya', 'Aadhya', 'Saanvi', 'Pari', 'Diya', 'Myra', 'Kiara', 'Riya', 'Anika', 'Angel',
  'Avni', 'Vanshika', 'Aarohi', 'Meera', 'Aditi', 'Prisha', 'Rishika', 'Siya', 'Navya', 'Aarya',
  'Rahul', 'Amit', 'Suresh', 'Ramesh', 'Vijay', 'Sanjay', 'Manoj', 'Rajesh', 'Sunil', 'Anil',
  'Priya', 'Neha', 'Sneha', 'Pooja', 'Kavita', 'Anita', 'Sunita', 'Geeta', 'Rekha', 'Suman',
  'Vikram', 'Nikhil', 'Abhishek', 'Pranav', 'Siddharth', 'Kunal', 'Harsh', 'Mayank', 'Gaurav', 'Deepak'
];

const LAST_NAMES = [
  'Patil', 'Deshmukh', 'Joshi', 'Kulkarni', 'Kale', 'Chavan', 'Pawar', 'Shinde', 'Jadhav', 'More',
  'Gaikwad', 'Kadam', 'Bhosale', 'Sawant', 'Raut', 'Mane', 'Ghadge', 'Salunkhe', 'Thorat', 'Ghorpade',
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Mishra', 'Yadav', 'Das', 'Nair', 'Reddy',
  'Shah', 'Mehta', 'Patel', 'Gandhi', 'Modi', 'Ambani', 'Tata', 'Birla', 'Godrej', 'Bajaj',
  'Wagh', 'Shetty', 'Kamble', 'Bansode', 'Waghmare', 'Sonawane', 'Ingale', 'Kharat', 'Lokhande', 'Sartape',
  'Malhotra', 'Khanna', 'Kapoor', 'Saxena', 'Bhatia', 'Chopra', 'Jain', 'Agarwal', 'Rao', 'Iyer'
];

const CAR_TYPES = [
  { model: 'Maruti Swift', type: '4-seater' },
  { model: 'Hyundai i20', type: '4-seater' },
  { model: 'Tata Nexon', type: '4-seater' },
  { model: 'Honda City', type: '4-seater' },
  { model: 'Toyota Innova', type: '7-seater' },
  { model: 'Mahindra XUV700', type: '7-seater' },
  { model: 'Maruti Ertiga', type: '7-seater' },
  { model: 'Hyundai Creta', type: '4-seater' },
  { model: 'Kia Seltos', type: '4-seater' },
  { model: 'Tata Safari', type: '7-seater' },
  { model: 'Mahindra Scorpio', type: '7-seater' },
  { model: 'Toyota Fortuner', type: '7-seater' },
  { model: 'Maruti Baleno', type: '4-seater' },
  { model: 'Tata Altroz', type: '4-seater' },
  { model: 'Mahindra Thar', type: '4-seater' }
];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Generating 800 Users...');
    const users = [];
    const passwordHash = await argon2.hash('Password@123');

    for (let i = 0; i < 800; i++) {
      const firstName = getRandomElement(FIRST_NAMES);
      const lastName = getRandomElement(LAST_NAMES);
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(1, 999999)}@example.com`;
      const phone = `9${getRandomInt(100000000, 999999999)}`;

      users.push({
        name,
        email,
        password: passwordHash,
        phone,
        role: 'user',
        address: getRandomElement(INDIAN_CITIES),
        bio: 'Love travelling and meeting new people!',
        rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
        totalRatings: getRandomInt(5, 50)
      });
    }

    try {
        await User.insertMany(users, { ordered: false });
    } catch (e) {
        console.log('Some users might have been duplicates, continuing...');
    }
    
    // Fetch all valid hosts
    const allUsers = await User.find({ phone: { $exists: true, $ne: null } });
    console.log(`Total valid hosts (with phone) in DB: ${allUsers.length}`);

    if (allUsers.length === 0) {
        throw new Error('No users with phone numbers found to be hosts.');
    }

    console.log('Generating 1000 Rides...');
    const rides = [];
    const now = new Date();

    for (let i = 0; i < 1000; i++) {
      const host = getRandomElement(allUsers);
      const from = getRandomElement(INDIAN_CITIES);
      let to = getRandomElement(INDIAN_CITIES);
      while (to === from) {
        to = getRandomElement(INDIAN_CITIES);
      }

      const daysAhead = getRandomInt(1, 60);
      const rideDate = new Date(now);
      rideDate.setDate(rideDate.getDate() + daysAhead);

      const car = getRandomElement(CAR_TYPES);
      const seats = car.type === '7-seater' ? getRandomInt(4, 6) : getRandomInt(2, 3);
      const price = getRandomInt(200, 3000);

      rides.push({
        host: host._id,
        from,
        to,
        date: rideDate,
        time: `${getRandomInt(6, 22)}:00`,
        price,
        seats,
        seatsAvailable: seats,
        phone: host.phone,
        description: `Travelling from ${from} to ${to}. Join me!`,
        carModel: car.model,
        carType: car.type
      });
    }

    await Ride.insertMany(rides);
    console.log(`Created ${rides.length} rides.`);

    console.log('Data Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
