const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

// Register new user (HR or Employee)
const registerUser = async (req, res) => {
  const { name, email, password, role, contactDetails } = req.body;
  const department = role;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required' });
  }
  console.log(req.body);
  try {
    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    // Create associated employee profile if the role is 'employee'
    const employee = await new Employee({
      user: user._id,
      contactDetails,
      department: role,
    }).populate();

    if (role === 'employee') employee.department = department;
    await employee.save();

    const token = generateToken(user._id, user.role);
    res.json({ message: "Registered Successfully", token, role: user.role, details: employee });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};


// Login user
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
    console.log(user, email, password);

    // Send JWT token in response
    const token = generateToken(user._id, user.role);
    const emloyeeDetails = await Employee.findOne({ user: user._id }).populate("user");
    // console.log(emloyeeDetails);
    res.json({ token, role: user.role, details: emloyeeDetails });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout user (Just expire the token on frontend side)
const logoutUser = (req, res) => {
  res.json({ message: 'User logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser
};