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
import { generateAPIKey } from "./src/apiKey.js";
import { APIAuth } from "./src/apiAuth.js";

dotenv.config({
  path: ".env.server",
});

dotenv.config({
  path: ".env.mail",
});

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
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
      "http://localhost:3000/auth"
    );
  }

  try {
    Verify(token);

    return res.redirect(
      "http://localhost:3000"
    );
  } catch (err) {
    console.error(err);

    return res.redirect(
      "http://localhost:3000/auth"
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
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>WebAudit API Documentation</title>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 30px;
      background: #05051f;
      color: white;
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }

    .container {
      width: min(900px, 100%);
      margin: 0 auto;
    }

    h1 {
      color: #818cf8;
    }

    h2 {
      margin-bottom: 8px;
    }

    .endpoint {
      background: #11112d;
      border: 1px solid #29294d;
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
    }

    .method {
      color: #4ade80;
      font-weight: bold;
    }

    pre {
      background: #050510;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }

    @media (max-width: 600px) {
      body {
        padding: 15px;
      }

      .endpoint {
        padding: 15px;
      }
    }
  </style>
</head>

<body>
  <div class="container">

    <h1>WebAudit API</h1>

    <p>
      Analyze websites and retrieve performance,
      SEO, accessibility and best-practice data.
    </p>

    <h2>Authentication</h2>

    <p>
      Protected endpoints require:
    </p>

    <pre>Authorization: Bearer YOUR_API_KEY</pre>

    <div class="endpoint">
      <h2>
        <span class="method">GET</span>
        /api/v1/health
      </h2>

      <p>
        Check whether the API is running.
      </p>

      <pre>curl https://YOUR_DOMAIN/api/v1/health</pre>
    </div>

    <div class="endpoint">
      <h2>
        <span class="method">GET</span>
        /api/v1/history
      </h2>

      <p>
        Retrieve previous website audits.
      </p>

      <pre>curl https://YOUR_DOMAIN/api/v1/history \\
-H "Authorization: Bearer YOUR_API_KEY"</pre>
    </div>

    <div class="endpoint">
      <h2>
        <span class="method">GET</span>
        /api/v1/data
      </h2>

      <p>
        Retrieve the latest audit for a URL.
      </p>

      <pre>curl "https://YOUR_DOMAIN/api/v1/data?url=https://example.com" \\
-H "Authorization: Bearer YOUR_API_KEY"</pre>
    </div>

    <div class="endpoint">
      <h2>
        <span class="method">POST</span>
        /api/v1/analyze
      </h2>

      <p>
        Run a new website audit.
      </p>

      <pre>curl -X POST https://YOUR_DOMAIN/api/v1/analyze \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-d '{"url":"https://example.com"}'</pre>
    </div>

    <div class="endpoint">
      <h2>Example Response</h2>

      <pre>{
  "status": true,
  "data": {
    "URL": "https://example.com",
    "Performance": {
      "Score": 0.92
    },
    "SEO": {
      "Score": 1
    },
    "Accessibility": {
      "Score": 0.95
    },
    "Best_Practices": {
      "Score": 0.9
    }
  }
}</pre>
    </div>

  </div>
</body>
</html>
  `);
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

    const OTP = Math.floor(
      100000 + Math.random() * 900000
    );

    const expires = new Date(
      Date.now() + 5 * 60 * 1000
    );

    const html = template.replace(
      "{{OTP}}",
      String(OTP)
    );

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject:
        "Verify Your Email - WebOrbit",
      html,
    });

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
    console.error(err);

    return res.status(500).json({
      status: false,
      message: "Failed to send OTP.",
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

      res.cookie(
        "auth_token",
        token,
        {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge:
            20 *
            24 *
            60 *
            60 *
            1000,
        }
      );

      return res.status(200).json({
        status: true,
        message:
          "OTP verified successfully.",
        redirect:
          "http://localhost:4000",
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