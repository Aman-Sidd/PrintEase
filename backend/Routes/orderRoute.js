const Order = require("../models/Order");
const express = require("express");
const router = express.Router();

router.post("/order", async (req, res) => {
  try {
    const { userId, shopOwnerId, pdfFile, orderDetails, totalPrice, status } =
      req.body;

    const order = new Order({
      user: userId,
      shopOwner: shopOwnerId,
      pdfFile,
      orderDetails,
      totalPrice,
      status,
    });

    await order.save();

    return res.status(200).json({ message: "Order successfully created." });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/order/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const orderInfoThroughUserId = await Order.find({ user: id });

    if (orderInfoThroughUserId.length > 0) {
      return res.status(200).json(orderInfoThroughUserId);
    }
    const orderInfoThroughShopOwnerId = await Order.find({
      shopOwner: id,
    });

    if (orderInfoThroughShopOwnerId.length > 0) {
      //   console.log(orderInfoThroughShopOwnerId);
      return res.status(200).json(orderInfoThroughShopOwnerId);
    }
    return res.status(204).json({ message: "Could not find Order. :(" });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ message: "Something went wrong" });
  }
});

module.exports = router;
