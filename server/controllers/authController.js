const User = require('../models/User');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const Joi = require('joi');

// Validation Schemas
const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])')).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.register = async (req, res) => {
  // Validate Data
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exists');

  // Hash password
  const hashedPassword = await argon2.hash(req.body.password);

  // Create User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    // Create and assign token
    const token = jwt.sign({ _id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET);
    res.header('auth-token', token).status(201).send({ 
      token,
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.login = async (req, res) => {
  // Validate Data
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email is not found');

  // Check password
  const validPass = await argon2.verify(user.password, req.body.password);
  if (!validPass) return res.status(400).send('Invalid password');

  // Create and assign token
  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.header('auth-token', token).status(200).send({ 
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
