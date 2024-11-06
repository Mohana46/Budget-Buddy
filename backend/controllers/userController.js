const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// @desc Register a new user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Create new user
    const user = await User.create({ username, email, password });

    if (user) {
        res.status(201).json({ _id: user._id, email: user.email });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists && (await userExists.comparePassword(password))) {
        // Generate JWT token
        const token = jwt.sign({
            id: userExists._id,
            username: userExists.username,
            email: userExists.email
        }, process.env.JWT_SECRET, { expiresIn: "2d" });
        res.status(200).json({ token });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc Get current user
// @route GET /api/users/current
// @access Private

const currentUser = asyncHandler(async (req, res) => {
   // console.log(req.user); 
    res.json({ id: req.user.id,username: req.user.username });
});



module.exports = {
    registerUser,
    loginUser,
    currentUser
};
