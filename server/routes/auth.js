const router = require('express').Router();
const authController = require('../controllers/authController');
const forgotPasswordController = require('../controllers/forgotPasswordController');

// REGISTER
router.post('/register', authController.register);

// LOGIN
router.post('/login', authController.login);

// FORGOT PASSWORD
router.post('/forgot-password', forgotPasswordController.requestPasswordReset);
router.post('/verify-otp', forgotPasswordController.verifyOtp);
router.post('/reset-password', forgotPasswordController.resetPassword);

module.exports = router;
