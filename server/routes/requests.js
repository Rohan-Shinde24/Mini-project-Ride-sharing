const router = require('express').Router();
const requestController = require('../controllers/requestController');
const verify = require('../middleware/auth');

// REQUEST A SEAT
router.post('/', verify, requestController.createRequest);

// UPDATE REQUEST STATUS (Driver Only)
router.put('/:id/status', verify, requestController.updateRequestStatus);

// GET RECEIVED REQUESTS (for rides I created)
router.get('/received', verify, requestController.getReceivedRequests);

// GET SENT REQUESTS (requests I made)
router.get('/sent', verify, requestController.getSentRequests);

module.exports = router;
