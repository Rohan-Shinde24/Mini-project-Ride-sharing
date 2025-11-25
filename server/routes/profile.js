const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, getUserProfile, updateProfile, rateUser } = require('../controllers/profileController');

// Get current user's profile
router.get('/', auth, getProfile);

// Get public profile of any user
router.get('/:userId', getUserProfile);

// Update current user's profile
router.put('/', auth, updateProfile);

// Rate a user
router.post('/rate/:userId', auth, rateUser);

module.exports = router;
