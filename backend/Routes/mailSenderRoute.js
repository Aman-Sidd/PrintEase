const express = require("express");
const multer = require("multer");
const app = express.Router();
const emailService = require("../components/emailService");

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// API endpoint to receive PDF and send email
app.post("/send-email", upload.single("pdf"), async (req, res) => {
  try {
    const { email, pageSize, color, printType, pricePerPage, noOfPages } =
      req.body;
    const pdfPath = req.file.path;
    const pdfFilename = req.file.filename;

    await emailService.sendEmail(
      email,
      pdfPath,
      pdfFilename,
      pageSize,
      color,
      printType,
      pricePerPage,
      noOfPages
    );
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
