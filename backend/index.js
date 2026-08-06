import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import otp, { user } from "./src/db.js";
import transporter from "./src/mail.js";
import template from "./src/emailTemplate.js";
import { Sign, Verify } from "./src/jwt.js";
import Lighthouse from "./src/lighthouse.js";

dotenv.config({ path: ".env.server" });
dotenv.config({ path: ".env.mail" });

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: 15 * 1000,
    limit: 5,
  })
);

app.get("/", (req, res) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.redirect("http://localhost:3000/auth");
  }

  try {
    Verify(token);
    return res.redirect("http://localhost:3000");
  } catch (err) {
    console.error(err);
    return res.redirect("http://localhost:3000/auth");
  }
});

app.post("/ui/analyze", async (req, res) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Authentication required.",
      });
    }

    const userData = Verify(token);

    const lighthouseData = await Lighthouse(req.body.url);

    if (lighthouseData.fetchError) {
      return res.status(400).json(lighthouseData);
    }

    if (lighthouseData.lighthouseError) {
      return res.status(500).json(lighthouseData);
    }

    await user.findByIdAndUpdate(
      userData.objectID,
      {
        $push: {
          History: lighthouseData,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json(lighthouseData);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
});

app.post("/auth", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required.",
      });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);

    const expires = new Date(Date.now() + 5 * 60 * 1000);

    const html = template.replace("{{OTP}}", String(OTP));

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email - WebOrbit",
      html,
    });

    await otp.findOneAndUpdate(
      { Email: email },
      {
        $set: {
          OTP,
          Expires: expires,
        },
      },
      {
        upsert: true,
      }
    );

    return res.status(200).json({
      status: true,
      message: "OTP sent successfully.",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      message: "Failed to send OTP.",
    });
  }
});

app.post("/auth/otp", async (req, res) => {
  try {
    const { email, otp: userOTP } = req.body;

    if (!email || !userOTP) {
      return res.status(400).json({
        status: false,
        message: "Email and OTP are required.",
      });
    }

    const data = await otp.findOne({
      Email: email,
    });

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "OTP not found.",
      });
    }

    if (new Date() > data.Expires) {
      return res.status(401).json({
        status: false,
        message: "OTP expired.",
      });
    }

    if (String(data.OTP) !== String(userOTP)) {
      return res.status(401).json({
        status: false,
        message: "Invalid OTP.",
      });
    }

    const objectID = await user.findOneAndUpdate(
      {
        Email: email,
      },
      {
        $set: {
          Email: email,
          createdAt: Date.now(),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    const token = Sign(email, objectID._id);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: true,
      message: "OTP verified successfully.",
      redirect: "http://localhost:4000",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});