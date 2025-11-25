const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Import Routes
const authRoute = require('./routes/auth');
const rideRoute = require('./routes/rides');
const requestRoute = require('./routes/requests');
const userRoute = require('./routes/users');
const profileRoute = require('./routes/profile');

// Route Middlewares
app.use('/api/auth', authRoute);
app.use('/api/rides', rideRoute);
app.use('/api/requests', requestRoute);
app.use('/api/users', userRoute);
app.use('/api/profile', profileRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
