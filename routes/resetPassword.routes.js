const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Adjust the path according to your project structure
const router = express.Router();

// Reset Password Route
router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // const salt = await bcrypt.genSalt(10);
        // // Hash the new password
        // const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update the user's password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
