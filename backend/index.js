import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { doc } from "./src/doc.js";
import Lighthouse from "./src/lighthouse.js";

import {
  connectDB,
  Developer,
  AuditHistory,
} from "./src/db.js";

import {
  createAPIKey,
} from "./src/apiKey.js";

import {
  generateDeveloperSecret,
  hashSecret,
  developerAuth,
} from "./src/developerAuth.js";

import { APIAuth } from "./src/apiAuth.js";

dotenv.config();

await connectDB();

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "https://web-audit-api-kappa.vercel.app",
    credentials: false,
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

app.get("/api/v1/health", (req, res) => {
  return res.status(200).json({
    status: true,
    service: "WebAudit API",
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/v1/info", (req, res) => {
  return res.status(200).json({
    status: true,
    name: "WebAudit API",
    version: "1.0.0",
    description:
      "Website performance, SEO, accessibility and best-practice auditing API.",
    endpoints: {
      health: "GET /api/v1/health",
      info: "GET /api/v1/info",
      limits: "GET /api/v1/limits",
      history: "GET /api/v1/history",
      analyze: "POST /api/v1/analyze",
    },
    authentication: "API key",
  });
});

app.get("/api/v1/limits", (req, res) => {
  return res.status(200).json({
    status: true,
    limits: {
      general: {
        window: "15 seconds",
        requests: 5,
      },
      developerAPI: {
        window: "60 seconds",
        requests: 30,
      },
    },
  });
});

app.post("/api/v1/developers", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        status: false,
        message: "Name is required.",
      });
    }

    const secret = generateDeveloperSecret();

    const developer = await Developer.create({
      name: name.trim(),
      secretHash: hashSecret(secret),
    });

    return res.status(201).json({
      status: true,
      message: "Developer account created.",
      developer: {
        id: developer._id,
        name: developer.name,
      },
      secret,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      message: "Failed to create developer account.",
    });
  }
});

app.post(
  "/api/v1/keys",
  developerAuth,
  async (req, res) => {
    try {
      console.log("Developer:", req.developer);

      const result = await createAPIKey(
        req.developer._id
      );

      console.log("API key created:", result);

      return res.status(201).json({
        status: true,
        message: "API key created successfully.",
        apiKey: result.key,
        id: result.id,
      });
    } catch (err) {
      console.error("CREATE API KEY ERROR:", err);

      return res.status(500).json({
        status: false,
        message: "Failed to create API key.",
      });
    }
  }
);

app.post("/ui/analyze", developerAuth, async (req, res) => {
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

    const lighthouseData = await Lighthouse(url);

    if (lighthouseData.fetchError) {
      return res.status(400).json(lighthouseData);
    }

    if (lighthouseData.lighthouseError) {
      return res.status(500).json(lighthouseData);
    }

    await AuditHistory.create({
      ownerType: "ui",
      ownerId: req.developer._id.toString(),
      URL: lighthouseData.URL || url,
      StatusCode: lighthouseData.StatusCode,
      Performance: lighthouseData.Performance,
      SEO: lighthouseData.SEO,
      Accessibility: lighthouseData.Accessibility,
      Best_Practices: lighthouseData.Best_Practices,
      LCP: lighthouseData.LCP,
      FCP: lighthouseData.FCP,
      CLS: lighthouseData.CLS,
      SpeedIndex: lighthouseData.SpeedIndex,
      Latency: lighthouseData.Latency,
      Result: lighthouseData,
    });

    return res.status(200).json(lighthouseData);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
});

app.get(
  "/ui/history",
  developerAuth,
  async (req, res) => {
    try {
      const history = await AuditHistory.find({
        ownerType: "ui",
        ownerId: req.developer._id.toString(),
      })
        .sort({ Timestamp: -1 })
        .lean();

      return res.status(200).json({
        status: true,
        count: history.length,
        History: history,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        status: false,
        message: "Failed to fetch UI history.",
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

      const lighthouseData = await Lighthouse(url);

      if (lighthouseData.fetchError) {
        return res.status(400).json(lighthouseData);
      }

      if (lighthouseData.lighthouseError) {
        return res.status(500).json(lighthouseData);
      }

      await AuditHistory.create({
        ownerType: "api",
        ownerId: req.apiKey._id.toString(),
        URL: lighthouseData.URL || url,
        StatusCode: lighthouseData.StatusCode,
        Performance: lighthouseData.Performance,
        SEO: lighthouseData.SEO,
        Accessibility: lighthouseData.Accessibility,
        Best_Practices: lighthouseData.Best_Practices,
        LCP: lighthouseData.LCP,
        FCP: lighthouseData.FCP,
        CLS: lighthouseData.CLS,
        SpeedIndex: lighthouseData.SpeedIndex,
        Latency: lighthouseData.Latency,
        Result: lighthouseData,
      });

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
  }
);

app.get(
  "/api/v1/history",
  APIAuth,
  async (req, res) => {
    try {
      const history = await AuditHistory.find({
        ownerType: "api",
        ownerId: req.apiKey._id.toString(),
      })
        .sort({ Timestamp: -1 })
        .lean();

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

app.get("/docs", (req, res) => {
  res.send(doc);
});

app.get("/", (req, res) => {
  res.redirect(
    "https://web-audit-api-kappa.vercel.app/"
  );
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server started on port ${process.env.PORT}`
  );
});