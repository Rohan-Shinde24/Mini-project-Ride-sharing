const User = require('../models/User');
const Ride = require('../models/Ride');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const totalRides = await Ride.countDocuments();
    
    // Aggregation for user roles
    const userRoles = await User.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Aggregation for rides by status (assuming status field exists or just total)
    // If Ride model has status, we can group by it. For now, just total.
    
    // Recent users
    const recentUsers = await User.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-password');

    res.json({
      totalUsers,
      totalRides,
      userRoles,
      recentUsers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Soft delete user
// @route   PUT /api/admin/users/:id/suspend
// @access  Private/Admin
exports.softDeleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user.id) {
        return res.status(400).json({ msg: 'Cannot delete yourself' });
    }

    user.isDeleted = true;
    await user.save();

    res.json({ msg: 'User soft deleted', userId: user._id });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get recycled users
// @route   GET /api/admin/recycle-bin
// @access  Private/Admin
exports.getRecycledUsers = async (req, res) => {
    try {
      const users = await User.find({ isDeleted: true }).select('-password').sort({ createdAt: -1 });
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

// @desc    Restore user
// @route   PUT /api/admin/users/:id/restore
// @access  Private/Admin
exports.restoreUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isDeleted = false;
    await user.save();

    res.json({ msg: 'User restored', userId: user._id });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
  }

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent demoting self if you are the only admin (optional safety check)
    if (user._id.toString() === req.user.id && role !== 'admin') {
         return res.status(400).json({ msg: 'Cannot change your own role' });
    }

    user.role = role;
    await user.save();

    res.json({ msg: 'User role updated', user: { _id: user._id, role: user.role } });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
    const { name, email, password, role, phone, bio } = req.body;
    const argon2 = require('argon2');

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const hashedPassword = await argon2.hash(password);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            phone,
            bio
        });

        await user.save();
        res.json({ msg: 'User created successfully', user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
    const { name, email, phone, bio } = req.body;

    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email; // Note: Should ideally check for uniqueness if changing email
        if (phone) user.phone = phone;
        if (bio) user.bio = bio;

        await user.save();
        res.json({ msg: 'User updated successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get user details with history
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const ridesOffered = await Ride.find({ host: req.params.id }).sort({ date: -1 });
        const Request = require('../models/Request');
        const ridesTaken = await Request.find({ passenger: req.params.id }).populate('ride').sort({ createdAt: -1 });

        res.json({ user, ridesOffered, ridesTaken });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all rides
// @route   GET /api/admin/rides
// @access  Private/Admin
exports.getAllRides = async (req, res) => {
    try {
        const rides = await Ride.find().populate('host', 'name email').sort({ date: -1 });
        res.json(rides);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

