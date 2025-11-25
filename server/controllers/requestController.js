const Request = require('../models/Request');
const Ride = require('../models/Ride');

exports.createRequest = async (req, res) => {
  const { rideId, seats = 1, phone } = req.body;

  try {
    // Validate phone number
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).send('Please provide a valid 10-digit mobile number');
    }

    // Validate seats
    if (!seats || seats < 1) {
      return res.status(400).send('Please select at least 1 seat');
    }

    // Check if ride exists
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).send('Ride not found');

    // Check if enough seats available
    if (ride.seatsAvailable < seats) {
      return res.status(400).send(`Only ${ride.seatsAvailable} seat(s) available`);
    }

    // Check if user already requested
    const existingRequest = await Request.findOne({ passenger: req.user._id, ride: rideId });
    if (existingRequest) return res.status(400).send('You have already requested this ride');

    // Check if user is the host
    if (ride.host.toString() === req.user._id) return res.status(400).send('You cannot request your own ride');

    const request = new Request({
      passenger: req.user._id,
      ride: rideId,
      seats: seats,
      phone: phone
    });

    const savedRequest = await request.save();
    res.status(201).send(savedRequest);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.updateRequestStatus = async (req, res) => {
  const { status } = req.body; // 'accepted' or 'rejected'
  
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).send('Invalid status');
  }

  try {
    const request = await Request.findById(req.params.id).populate('ride');
    if (!request) return res.status(404).send('Request not found');

    // Check if current user is the host of the ride
    if (request.ride.host.toString() !== req.user._id) {
      return res.status(403).send('Access Denied');
    }

    // If accepting, check seats again
    if (status === 'accepted' && request.status !== 'accepted') {
       if (request.ride.seatsAvailable < request.seats) {
         return res.status(400).send(`Only ${request.ride.seatsAvailable} seat(s) available`);
       }
       // Decrement seats by the requested amount
       await Ride.findByIdAndUpdate(request.ride._id, { $inc: { seatsAvailable: -request.seats } });
    }

    // If rejecting a previously accepted request, increment seats back
    if (status === 'rejected' && request.status === 'accepted') {
       await Ride.findByIdAndUpdate(request.ride._id, { $inc: { seatsAvailable: request.seats } });
    }
    
    request.status = status;
    const updatedRequest = await request.save();
    res.send(updatedRequest);

  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getReceivedRequests = async (req, res) => {
  try {
    // Find all rides created by the user
    const myRides = await Ride.find({ host: req.user._id });
    const rideIds = myRides.map(ride => ride._id);
    
    // Find all requests for those rides
    const requests = await Request.find({ ride: { $in: rideIds } })
      .populate('passenger', 'name email')
      .populate('ride')
      .sort({ createdAt: -1 });
    
    res.send(requests);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getSentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ passenger: req.user._id })
      .populate('ride')
      .populate({
        path: 'ride',
        populate: {
          path: 'host',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });
    
    res.send(requests);
  } catch (err) {
    res.status(400).send(err);
  }
};
