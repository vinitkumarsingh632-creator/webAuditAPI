import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  pool: true,
  maxConnections: 5,
  maxMessages: 100,

  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP ERROR:", error);
  } else {
    console.log("SMTP READY");
  }
});

export default transporter;