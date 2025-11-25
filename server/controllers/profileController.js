const User = require('../models/User');

// Get current user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Server error');
  }
};

// Get public profile of any user by ID
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password -email');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Server error');
  }
};

// Update current user's profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, bio } = req.body;
    
    // Validate phone number if provided
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).send('Phone number must be 10 digits');
    }
    
    // Validate address length
    if (address && address.length > 200) {
      return res.status(400).send('Address must be less than 200 characters');
    }
    
    // Validate bio length
    if (bio && bio.length > 500) {
      return res.status(400).send('Bio must be less than 500 characters');
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (bio !== undefined) updateData.bio = bio;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).send(error.message || 'Failed to update profile');
  }
};

// Rate a user (for future enhancement)
const rateUser = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.params.userId;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).send('Rating must be between 1 and 5');
    }
    
    // Prevent self-rating
    if (userId === req.user._id.toString()) {
      return res.status(400).send('You cannot rate yourself');
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    // Calculate new rating
    const currentTotal = user.rating * user.totalRatings;
    const newTotal = currentTotal + rating;
    const newTotalRatings = user.totalRatings + 1;
    const newRating = newTotal / newTotalRatings;
    
    user.rating = Math.round(newRating * 10) / 10; // Round to 1 decimal
    user.totalRatings = newTotalRatings;
    await user.save();
    
    res.json({ message: 'Rating submitted successfully', rating: user.rating });
  } catch (error) {
    console.error('Error rating user:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getProfile,
  getUserProfile,
  updateProfile,
  rateUser
};
