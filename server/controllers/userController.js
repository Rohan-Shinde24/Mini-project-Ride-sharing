const Ride = require('../models/Ride');
const Request = require('../models/Request');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    // Rides offered by the user
    const ridesOffered = await Ride.find({ host: req.user._id }).sort({ date: 1 });

    // Requests made by the user
    const requestsMade = await Request.find({ passenger: req.user._id })
      .populate({
        path: 'ride',
        populate: { path: 'host', select: 'name' }
      })
      .sort({ createdAt: -1 });

    // Requests received for user's rides
    // Find all rides by user first
    const myRideIds = ridesOffered.map(r => r._id);
    const requestsReceived = await Request.find({ ride: { $in: myRideIds } })
      .populate('passenger', 'name email')
      .populate('ride', 'from to date')
      .sort({ createdAt: -1 });

    res.send({
      ridesOffered,
      requestsMade,
      requestsReceived
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};
