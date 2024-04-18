require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const authRoute = require("./Routes/authRoutes");
const bodyParser = require("body-parser");
const requireAuth = require("./middlewares/requireAuth");
const shopOwnerRoute = require("./Routes/shopOwnerRoutes");
const orderRoute = require("./Routes/orderRoute");
const mailSenderRoute = require("./Routes/mailSenderRoute");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(authRoute);
app.use(shopOwnerRoute);
app.use(orderRoute);
app.use(mailSenderRoute);

mongoose
  .connect(
    "mongodb+srv://printease:printease123@printease.xqigmtf.mongodb.net/"
  )
  .then(() => console.log("DB is connected!"))
  .catch((err) => console.log("Error connecting to DB! ", err));

app.get("/", requireAuth, (req, res) => {
  const user = req.user;
  return res.status(200).send(user);
});

app.listen(port, () => {
  console.log("Server is running on port ", port);
});
