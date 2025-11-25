const router = require('express').Router();
const rideController = require('../controllers/rideController');
const verify = require('../middleware/auth');

// CREATE RIDE
router.post('/', verify, rideController.createRide);

// SEARCH RIDES
router.get('/', rideController.searchRides);

// GET MY RIDES
router.get('/my-rides', verify, rideController.getMyRides);

module.exports = router;
