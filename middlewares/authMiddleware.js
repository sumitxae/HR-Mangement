// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check for HR role
exports.isHR = (req, res, next) => {
    if (req.user && req.user.role === 'hr') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as HR' });
    }
};

// Middleware to check for Employee role
exports.isEmployee = (req, res, next) => {
    if (req.user && req.user.role === 'employee') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as Employee' });
    }
};
