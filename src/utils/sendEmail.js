const nodemailer = require("nodemailer");

const sendEmail = (booking) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.EMAIL_PASSKEY,
    },
  });

  //Define Email Options

  const message = `
  <body>
    <h1>Your Invoice is Ready</h1>
    <p>Click the button below to download your invoice:</p>
    <a 
      href="https://flexi-desk-booking.onrender.com/api/flexibooking/get-invoice-pdf/${booking._id}" 
      style="
        display: inline-block;
        padding: 10px 20px;
        background-color: #007BFF;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;"
      download
    >
      Download Invoice PDF
    </a>
    <p>If you have any issues, please contact support.</p>
  </body>
`;
  console.log("eamil", process.env.FROM_EMAIL);

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: `${booking.guest_email}`,
    subject: "Invoice PDF",
    html: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = sendEmail;
