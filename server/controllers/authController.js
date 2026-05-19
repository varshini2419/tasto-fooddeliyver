const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, phone, password, address, pinCode, landmark, hostelBlock } = req.body;

        // Validation
        if (!name || !phone || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: 'Please enter a valid 10-digit Indian phone number' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const userExists = await User.findOne({ phone });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this phone number' });
        }

        // Create user (role defaults to 'customer')
        const user = await User.create({
            name,
            phone,
            password,
            address,
            pinCode,
            landmark,
            hostelBlock
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Validation
        if (!phone || !password) {
            return res.status(400).json({ message: 'Please provide phone and password' });
        }

        // Check for user
        const user = await User.findOne({ phone });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid phone number or password' });
        }
    } catch (error) {
        console.error("Login Error Detail: ", error);
        res.status(500).json({ message: "Server Error during login", error: error.message, stack: error.stack });
    }
};

module.exports = {
    registerUser,
    loginUser
};
