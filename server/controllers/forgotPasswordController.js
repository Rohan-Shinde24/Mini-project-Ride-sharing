const User = require('../models/User');
const argon2 = require('argon2');
const { generateOtp } = require('../utils/generateOtp');
const sendEmail = require('../utils/emailService');

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Request password reset - send OTP to email
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send('Email is required');
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If the email exists, an OTP has been sent' });
    }

    // Generate OTP
    const otp = generateOtp();
    console.log('DEBUG: Generated OTP for', email, 'is:', otp); // Log OTP for testing
    
    // Store OTP with expiration (10 minutes)
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 10000 // 10 minutes
    });

    // Send OTP via email
    try {
      const subject = 'Password Reset OTP';
      const message = `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`;
      await sendEmail(email, subject, message);
      res.json({ message: 'OTP sent to your email' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).send('Failed to send OTP email. Please try again.');
    }
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).send('Server error');
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).send('Email and OTP are required');
    }

    const storedOtpData = otpStore.get(email);

    if (!storedOtpData) {
      return res.status(400).send('OTP not found or expired');
    }

    // Check if OTP is expired
    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).send('OTP has expired');
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      return res.status(400).send('Invalid OTP');
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).send('Server error');
  }
};

// Reset password with OTP
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).send('Email, OTP, and new password are required');
    }

    // Validate password
    if (newPassword.length < 8) {
      return res.status(400).send('Password must be at least 8 characters');
    }

    const storedOtpData = otpStore.get(email);

    if (!storedOtpData) {
      return res.status(400).send('OTP not found or expired');
    }

    // Check if OTP is expired
    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).send('OTP has expired');
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      return res.status(400).send('Invalid OTP');
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Hash new password
    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;
    await user.save();

    // Clear OTP
    otpStore.delete(email);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  requestPasswordReset,
  verifyOtp,
  resetPassword
};
