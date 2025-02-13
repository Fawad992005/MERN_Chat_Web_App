// routes/login.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const cookieParser = require("cookie-parser");
const router = express.Router();

router.use(cookieParser());

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.SUPER_KEY, {
      expiresIn: "1h",
    });
    const userData = {
      _id: user._id,
      email: user.email,
      name: user.username,
      // include other non-sensitive fields
    };

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      secure: true,
    });
    res.json({
      message: "successful",
      user: userData,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
