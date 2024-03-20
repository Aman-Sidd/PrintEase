const mongoose = require("mongoose");

const shopOwnerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  // Add more fields as needed
});

const ShopOwner = mongoose.model("ShopOwner", shopOwnerSchema);

module.exports = ShopOwner;
