import dns from "node:dns";
import nodemailer from "nodemailer";

dns.setDefaultResultOrder("ipv4first");

dns.lookup("smtp.gmail.com", { all: true }, (err, addresses) => {
  if (err) {
    console.error("DNS ERROR:", err);
    return;
  }

  console.log("GMAIL DNS:", addresses);
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

export default transporter;