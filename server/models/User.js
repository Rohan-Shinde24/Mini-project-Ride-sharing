const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  phone: {
    type: String,
    required: false,
    match: /^[0-9]{10}$/
  },
  address: {
    type: String,
    required: false,
    maxlength: 200
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 1,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    required: false,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', userSchema);
