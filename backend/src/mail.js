import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "142.250.107.108",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },

  tls: {
    servername: "smtp.gmail.com",
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

export default transporter;