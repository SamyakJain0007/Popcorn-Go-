const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middlewares/authMiddleware');


// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Incoming registration request:", req.body);

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send({
        success: false,
        message: 'User already exists',
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).send({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error("Registration error:", error); 
    res.status(500).send({
      success: false,
      message: 'Server error during registration',
      error: error.message, 
    });
  }
});



// login route
router.post("/login", async (req, res) => {
  try {
    // find user by email (returns object)
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.send({
        success: false,
        message: "User does not exist",
      });
    }

    // check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.send({
        success: false,
        message: "Invalid password",
      });
    }

    // generate token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });

    res.send({
      success: true,
      message: "Login successful",
      data: token,
    });

  } catch (error) {
    console.error(error);
    res.send({
      success: false,
      message: "Error in login",
    });
  }
});



const express = require('express');

//getcurrentuser
router.get('/get-current-user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching user details",
      error: error.message,
    });
  }
});


module.exports = router;

