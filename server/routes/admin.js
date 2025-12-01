const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  getDashboardStats,
  getAllUsers,
  softDeleteUser,
  restoreUser,
  getRecycledUsers,
  updateUserRole,
  createUser,
  updateUser,
  getUserDetails,
  getAllRides
} = require('../controllers/adminController');

// All routes are protected and require admin role
router.use(auth, admin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/recycle-bin', getRecycledUsers);
router.put('/users/:id/suspend', softDeleteUser);
router.put('/users/:id/restore', restoreUser);
router.put('/users/:id/role', updateUserRole);

// New Routes
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.get('/users/:id', getUserDetails);
router.get('/rides', getAllRides);


module.exports = router;
