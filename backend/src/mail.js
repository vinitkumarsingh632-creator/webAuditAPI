import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "YOUR_GMAIL_IPV4",
  port: 587,
  secure: false,

  pool: true,
  maxConnections: 5,
  maxMessages: 100,

  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },

  tls: {
    servername: "smtp.gmail.com",
  },
});

export default transporter;