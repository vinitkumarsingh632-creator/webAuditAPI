import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config({
    path:'../.env.mail'
})
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

await transporter.sendMail({
  from: process.env.EMAIL,
  to: "vinitkumarsingh632@gmail.com",
  subject: "OTP Verification",
  text: "Your OTP is 123456"
});