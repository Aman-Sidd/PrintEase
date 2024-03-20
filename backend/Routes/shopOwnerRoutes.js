const ShopOwner = require("../models/ShopOwner");
const express = require("express");
const router = express.Router();

router.post("/shopowner", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const shopOwnerInfo = await ShopOwner.findOne({ email });
    if (shopOwnerInfo) {
      return res.status(200).json({ message: "User already exists" });
    }
    const user = new ShopOwner({ name, email, password });
    await user.save();
    return res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(505)
      .json({ message: "Something went wrong while creating ShopOwner" });
  }
});

module.exports = router;
