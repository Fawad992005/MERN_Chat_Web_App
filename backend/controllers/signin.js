const express = require("express");
const User = require("../models/user"); // Update path as needed
const jwt = require("jsonwebtoken");

const router = express.Router();

// Signup Route
router.post("/", async (req, res) => {
  try {
    const { username, email, password, pic } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user
    const userPic = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

    // Create a new user
    const user = new User({ username, email, password, pic: userPic });
    await user.save();


    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.SUPER_KEY, {
      expiresIn: "1h",
    });

    // Send the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
    });

    // Respond with success
    res.status(200).json({ message: "User created successfully"});
  } catch (error) {
    // Handle errors
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
