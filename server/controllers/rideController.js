const Ride = require('../models/Ride');
const Joi = require('joi');

// Validation Schema
const rideSchema = Joi.object({
  from: Joi.string().min(3).required(),
  to: Joi.string().min(3).required(),
  date: Joi.date().greater('now').required(),
  time: Joi.string().required(),
  price: Joi.number().min(0).required(),
  seats: Joi.number().integer().min(1).max(8).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  description: Joi.string().allow(''),
  carModel: Joi.string().required(),
  carType: Joi.string().valid('4-seater', '7-seater').required()
});

exports.createRide = async (req, res) => {
  // Validate Data
  const { error } = rideSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const ride = new Ride({
    host: req.user._id,
    from: req.body.from,
    to: req.body.to,
    date: req.body.date,
    time: req.body.time,
    price: req.body.price,
    seats: req.body.seats,
    seatsAvailable: req.body.seats, // Initially all seats are available
    phone: req.body.phone,
    description: req.body.description,
    carModel: req.body.carModel,
    carType: req.body.carType
  });

  try {
    const savedRide = await ride.save();
    res.status(201).send(savedRide);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.searchRides = async (req, res) => {
  const { from, to, date } = req.query;
  let query = {};

  if (from) query.from = { $regex: from, $options: 'i' };
  if (to) query.to = { $regex: to, $options: 'i' };
  if (date) {
    // Simple date matching (exact day)
    const searchDate = new Date(date);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    query.date = {
      $gte: searchDate,
      $lt: nextDay
    };
  }

  // Only show rides with available seats
  query.seatsAvailable = { $gt: 0 };

  try {
    const rides = await Ride.find(query).populate('host', 'name email');
    res.send(rides);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({ host: req.user._id }).sort({ date: -1 });
    res.send(rides);
  } catch (err) {
    res.status(400).send(err);
  }
};
