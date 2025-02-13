const User = require("../models/user");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.post("/", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({message:"User with this email does not exist."});
    }

    // Check if the OTP is valid and has not expired
    if (
      user.resetPasswordOtp !== otp ||
      Date.now() > user.resetPasswordExpire
    ) {
      return res.status(400).json({message:"Invalid or expired OTP."});
    }

    // Hash and update the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP and expiry after password reset
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfuly" });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
