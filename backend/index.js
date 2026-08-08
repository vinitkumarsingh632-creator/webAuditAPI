import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { doc } from "./src/doc.js";
import Lighthouse from "./src/lighthouse.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "https://web-audit-api-kappa.vercel.app",
    credentials: true,
  })
);

app.use(express.json());




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




app.post("/ui/analyze", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        status: false,
        message: "URL is required.",
      });
    }

    const lighthouseData = await Lighthouse(url);

    if (lighthouseData.fetchError) {
      return res.status(400).json(lighthouseData);
    }

    if (lighthouseData.lighthouseError) {
      return res.status(500).json(lighthouseData);
    }

    return res.status(200).json(lighthouseData);

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



app.post("/api/v1/analyze", async (req, res) => {
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
        message: "Only HTTP and HTTPS URLs are supported.",
      });
    }

    const lighthouseData = await Lighthouse(url);

    if (lighthouseData.fetchError) {
      return res.status(400).json(lighthouseData);
    }

    if (lighthouseData.lighthouseError) {
      return res.status(500).json(lighthouseData);
    }

    return res.status(200).json({
      status: true,
      data: lighthouseData,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      message: "Failed to analyze website.",
    });
  }
});




app.get("/docs", (req, res) => {
  res.send(doc);
});




app.get("/", (req, res) => {
  res.redirect("https://web-audit-api-kappa.vercel.app/");
});




app.listen(
  process.env.PORT,
  () => {
    console.log(
      `Server started on port ${process.env.PORT}`
    );
  }
);