const User = require("../models/User");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const crypto = require("crypto");
const secretKey = require("../constants/secretKey");
const requireAuth = require("../middlewares/requireAuth");

router.post("/signup", async (req, res) => {
  try {
    const userInfo = req.body;
    if (userInfo?.email) {
      const user = await User.findOne({ email: userInfo?.email });
      if (user) {
        console.log("user already exists.");
        return res
          .status(422)
          .json({ message: "User already exist with this email address" });
      }
    }

    const user = new User({
      name: userInfo.name,
      email: userInfo.email,
      password: userInfo.password,
      phoneNumber: userInfo.phone,
    });

    await user.save();

    const token = jwt.sign({ user_id: user._id }, secretKey);

    return res.status(200).send({ token });
  } catch (err) {
    console.log(err);
    return res
      .status(575)
      .send({ message: "Something went wrong while registering user" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(422).json({ message: "Invalid email or password!" });
    if (user.password != password)
      return res.status(422).json({ message: "Invalid email or password!" });

    const token = jwt.sign({ user_id: user._id }, secretKey);

    return res.status(200).send({
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phoneNumber,
      token,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(575)
      .send({ message: "Something went wrong while registering user" });
  }
});

module.exports = router;
