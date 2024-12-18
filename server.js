const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ "message": "Hello World" });
});
// Handle form submission
app.post("/send-email", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send({ error: "All fields are required!" });
  }

  // Nodemailer transporter configuration
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use other services like Outlook, Yahoo, etc.
    auth: {
      user: process.env.EMAIL, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password or app password
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL,
    to: email, // Send email to the user
    subject: "Thank you for contacting us!",
    html: `<h1>Hello ${name},</h1>
               <p>Thank you for reaching out to us. We have received your message:</p>
               <blockquote>Thank You very much</blockquote>
               <p>We will get back to you shortly!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to send email." });
  }
});

// Start the server
app.listen(PORT);
