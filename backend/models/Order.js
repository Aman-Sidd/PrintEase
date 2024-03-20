const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  shopOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShopOwner",
  },
  pdfFile: String, // This can be a reference to the stored file in your server or storage service
  orderDetails: String,
  totalPrice: Number,
  status: {
    type: String,
    enum: ["pending", "done", "delivered"],
    default: "pending",
  },
  // paymentDetails: {
  //   // Add payment details such as payment method, transaction ID, etc.
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
