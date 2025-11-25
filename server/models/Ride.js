const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  seats: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  seatsAvailable: {
    type: Number,
    required: true,
    min: 0
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ride', rideSchema);
