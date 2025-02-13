const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const otpGenerator = require("otp-generator");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist." });
    }

    // Generate a random 6-digit OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const otpExpire = Date.now() + 3600000; // OTP expires in 1 hour

    // Store OTP and its expiration in the user's document
    user.resetPasswordOtp = otp;
    user.resetPasswordExpire = otpExpire;
    await user.save();

    // Send the OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "fawaadahmed514@gmail.com",
        pass: "eilq tbso kumm wdyw",
      },
    });

    const mailOptions = {
      from: "fawaadahmed514@gmail.com",
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 1 hour.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending OTP" });
      } else {
        res.status(200).json({ message: "OTP sent to your email." });
      }
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
