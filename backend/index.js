import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { doc } from "./src/doc.js";
import otp, { user } from "./src/db.js";
import template from "./src/emailTemplate.js";
import { Sign, Verify } from "./src/jwt.js";
import Lighthouse from "./src/lighthouse.js";
import { generateAPIKey } from "./src/apiKey.js";
import { APIAuth } from "./src/apiAuth.js";
import { sendOTP } from "./src/mail.js";

dotenv.config()


const app = express();


app.set("trust proxy", 1);
app.use(
  cors({
    origin: "https://web-audit-api-kappa.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const generalLimiter = rateLimit({
  windowMs: 15 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: false,
    message: "Too many requests. Try again later.",
  },
});

app.use(generalLimiter);

const developerAPILimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: false,
    message: "Developer API rate limit exceeded.",
  },
});

app.use("/api/v1", developerAPILimiter);

app.get("/api/fetch", async (req, res) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Authentication required.",
      });
    }

    const userData = Verify(token);

    const response = await user.findById(
      userData.objectID
    );

    if (!response) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      status: true,
      APIKey: response.APIKey || null,
    });
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      status: false,
      message: "Authentication failed.",
    });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Authentication required.",
      });
    }

    const userData = Verify(token);

    const APIKey = generateAPIKey();

    await user.findByIdAndUpdate(
      userData.objectID,
      {
        $set: {
          APIKey,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: true,
      APIKey,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      message: "Failed to generate API key.",
    });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Authentication required.",
      });
    }

    const userData = Verify(token);

    const response = await user.findById(
      userData.objectID,
      {
        History: 1,
      }
    );

    if (!response) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      status: true,
      History: response.History || [],
    });
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      status: false,
      message: "Authentication failed.",
    });
  }
});

app.get("/", (req, res) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.redirect(
      "https://web-audit-api-kappa.vercel.app/auth"
    );
  }

  try {
    Verify(token);

    return res.redirect(
      "https://web-audit-api-kappa.vercel.app/"
    );
  } catch (err) {
    console.error(err);

    return res.redirect(
      "https://web-audit-api-kappa.vercel.app/auth"
    );
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

    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        status: false,
        message: "URL is required.",
      });
    }

    const lighthouseData =
      await Lighthouse(url);

    if (lighthouseData.fetchError) {
      return res.status(400).json(
        lighthouseData
      );
    }

    if (lighthouseData.lighthouseError) {
      return res.status(500).json(
        lighthouseData
      );
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

    return res.status(200).json(
      lighthouseData
    );
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
});

app.get("/api/v1/health", (req, res) => {
  return res.status(200).json({
    status: true,
    service: "WebAudit API",
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get(
  "/api/v1/history",
  APIAuth,
  async (req, res) => {
    try {
      const history =
        req.apiUser.History || [];

      return res.status(200).json({
        status: true,
        count: history.length,
        history,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        status: false,
        message: "Failed to fetch history.",
      });
    }
  }
);

app.get(
  "/api/v1/data",
  APIAuth,
  async (req, res) => {
    try {
      const { url } = req.query;

      if (!url) {
        return res.status(400).json({
          status: false,
          message:
            "URL query parameter is required.",
          example:
            "/api/v1/data?url=https://example.com",
        });
      }

      const history =
        req.apiUser.History || [];

      const matchingAudits =
        history.filter(
          (item) => item.URL === url
        );

      if (matchingAudits.length === 0) {
        return res.status(404).json({
          status: false,
          message:
            "No audit found for this URL.",
        });
      }

      const latest =
        matchingAudits[
          matchingAudits.length - 1
        ];

      return res.status(200).json({
        status: true,
        data: latest,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        status: false,
        message: "Failed to fetch data.",
      });
    }
  }
);

app.post(
  "/api/v1/analyze",
  APIAuth,
  async (req, res) => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({
          status: false,
          message: "URL is required.",
        });
      }

      let parsedURL;

      try {
        parsedURL = new URL(url);
      } catch {
        return res.status(400).json({
          status: false,
          message: "Invalid URL.",
        });
      }

      if (
        parsedURL.protocol !== "http:" &&
        parsedURL.protocol !== "https:"
      ) {
        return res.status(400).json({
          status: false,
          message:
            "Only HTTP and HTTPS URLs are supported.",
        });
      }

      const lighthouseData =
        await Lighthouse(url);

      if (lighthouseData.fetchError) {
        return res.status(400).json(
          lighthouseData
        );
      }

      if (lighthouseData.lighthouseError) {
        return res.status(500).json(
          lighthouseData
        );
      }

      await user.findByIdAndUpdate(
        req.apiUser._id,
        {
          $push: {
            History: lighthouseData,
          },
        }
      );

      return res.status(200).json({
        status: true,
        data: lighthouseData,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        status: false,
        message:
          "Failed to analyze website.",
      });
    }
  }
);

app.get("/docs", (req, res) => {
  res.send(doc);
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

    // Generate 6-digit OTP
    const OTP = Math.floor(
      100000 + Math.random() * 900000
    );

    // OTP expires after 5 minutes
    const expires = new Date(
      Date.now() + 5 * 60 * 1000
    );

    // Send OTP using Brevo
    await sendOTP(email, OTP);

    // Save/update OTP in MongoDB
    await otp.findOneAndUpdate(
      {
        Email: email,
      },
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
    console.error("AUTH ERROR:", err);

    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
});

app.post(
  "/auth/otp",
  async (req, res) => {
    try {
      const {
        email,
        otp: userOTP,
      } = req.body;

      if (!email || !userOTP) {
        return res.status(400).json({
          status: false,
          message:
            "Email and OTP are required.",
        });
      }

      const data =
        await otp.findOne({
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

      if (
        String(data.OTP) !==
        String(userOTP)
      ) {
        return res.status(401).json({
          status: false,
          message: "Invalid OTP.",
        });
      }

      const objectID =
        await user.findOneAndUpdate(
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

      const token = Sign(
        email,
        objectID._id
      );

      res.cookie("auth_token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 20 * 24 * 60 * 60 * 1000,
});

      return res.status(200).json({
        status: true,
        message:
          "OTP verified successfully.",
        redirect:
          "https://webauditapi.onrender.com",
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        status: false,
        message:
          "Internal server error.",
      });
    }
  }
);

app.listen(
  process.env.PORT,
  () => {
    console.log(
      `Server started on port ${process.env.PORT}`
    );
  }
);