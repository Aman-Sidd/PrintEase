const nodemailer = require("nodemailer");
const path = require("path");
const emailService = {
  sendEmail: async (
    email,
    pdfPath,
    pdfFilename,
    pageSize,
    color,
    printType,
    pricePerPage,
    noOfPages
  ) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_EMAIL_ID,
        pass: process.env.AUTH_APP_CODE,
      },
    });

    const mailOptions = {
      from: "your_email@gmail.com",
      to: email,
      subject: "PDF Attachment",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1 style="color: #333333;">Please find attached PDF</h1>
          <div style="margin-bottom: 20px;">
            <h2 style="color: #007bff;">DETAILS:</h2>
            <ul>
              <li><strong>File Name:</strong> ${pdfFilename}</li>
              <li><strong>Page Size:</strong> ${pageSize}</li>
              <li><strong>Color:</strong> ${color}</li>
              <li><strong>Print Type:</strong> ${printType}</li>
              <li><strong>Number of Pages:</strong> ${noOfPages}</li>
            </ul>
          </div>
          <div>
            <h2 style="color: #007bff;">PRICING:</h2>
            <ul>
              <li><strong>Price per Page:</strong> Rs. ${pricePerPage}</li>
              <li><strong>Total Cost:</strong> ${noOfPages} * Rs. ${pricePerPage} = ${
        noOfPages * pricePerPage
      }</li>
            </ul>
          </div>
        </div>`,
      attachments: [
        {
          filename: pdfFilename,
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: ", info.response);
      return info;
    } catch (error) {
      console.error("Error sending email: ", error);
      throw error;
    }
  },
};

module.exports = emailService;
