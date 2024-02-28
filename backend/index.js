const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3000 || process.env.PORT;
const authRoute = require("./Routes/authRoutes");
const bodyParser = require("body-parser");
const requireAuth = require("./middlewares/requireAuth");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(authRoute);
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
