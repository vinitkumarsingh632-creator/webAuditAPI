import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env.db",
});

try {
  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("DB Disconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err);
  });

  await mongoose.connect(process.env.DB_URI);
} catch (err) {
  console.log(err);
}


/* =========================
   OTP
========================= */

const OTP = new mongoose.Schema({
  OTP: {
    type: Number,
    required: true,
  },

  Email: {
    type: String,
    required: true,
  },

  Expires: {
    type: Date,
    default: Date.now,
    expires: 240,
  },
});


/* =========================
   USER
========================= */

const User = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  History: {
    type: Array,
    default: [],
  },

  APIKey: {
    type: String,
    default: null,
  },
});


const otp =
  mongoose.models.otpStore ||
  mongoose.model("otpStore", OTP);

export const user =
  mongoose.models.userDetail ||
  mongoose.model("userDetail", User);

export default otp;