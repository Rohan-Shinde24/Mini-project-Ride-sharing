const router = require('express').Router();
const userController = require('../controllers/userController');
const verify = require('../middleware/auth');

// DASHBOARD DATA
router.get('/dashboard', verify, userController.getDashboard);

// GET USER BY ID
router.get('/:id', verify, userController.getUserById);

module.exports = router;
