const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const secretKey = require("../constants/secretKey");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(422).json({ message: "Please log in to continue!" });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, secretKey, async (err, payload) => {
    if (err)
      return res.status(404).json({ message: "Please log in to contiue!" });

    const { user_id } = payload;
    const user = await User.findById(user_id);
    req.user = user;
    next();
  });
};
