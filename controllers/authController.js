// controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
};

// @desc    Register new user (HR or Employee)
const registerUser = async (req, res) => {
  const { name, email, password, role, jobRole, salary, contactDetails } = req.body;

  try {
    // Create User
    const user = new User({
      name,
      email,
      password,
      role, // role could be 'hr' or 'employee'
    });
    await user.save();

    // If the role is 'employee', create an associated employee profile
    if (role === 'employee') {
      const employee = new Employee({
        user: user._id,
        contactDetails,
        jobRole,
        salary,
      });
      await employee.save();
    }

    // Create JWT token for authentication
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      message: 'User registered successfully!',
      token, // Return the token after registration
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Send JWT token in response
        const token = generateToken(user._id, user.role);
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Logout user (Just expire the token on frontend side)
const logoutUser = (req, res) => {
    res.json({ message: 'User logged out successfully' });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};