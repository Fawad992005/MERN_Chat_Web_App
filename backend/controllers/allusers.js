const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

router.get("/", async (req, res) => {
  const keyword =
    req.query.search || ""
      ? {
          $or: [
            {
              username: { $regex: req.query.search, $options: "i" },
            },
            {
              email: { $regex: req.query.search, $options: "i" },
            },
          ],
        }
      : {};
  const users = await User.find({
    ...keyword,
    _id: { $ne: req.user.id },
  });
  res.send(users);
});

module.exports = router;
