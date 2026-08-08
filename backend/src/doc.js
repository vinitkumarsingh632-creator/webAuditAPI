export const doc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>WebAudit API Documentation</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 30px 20px;
      background: #05051f;
      color: white;
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }

    .container {
      width: min(900px, 100%);
      margin: auto;
    }

    h1 {
      color: #818cf8;
      margin-bottom: 8px;
    }

    h2 {
      margin-top: 30px;
      margin-bottom: 8px;
    }

    p {
      color: rgba(255,255,255,.75);
    }

    a {
      color: #818cf8;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .intro {
      margin-bottom: 30px;
    }

    .endpoint {
      margin-top: 25px;
      padding: 20px;

      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 14px;
    }

    .method {
      color: #4ade80;
      font-weight: bold;
      margin-right: 8px;
    }

    pre {
      background: #02020d;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 10px;

      padding: 15px;

      overflow-x: auto;

      color: #e5e7eb;
      font-family: monospace;
      font-size: 14px;

      white-space: pre-wrap;
      word-break: break-word;
    }

    code {
      color: #a5b4fc;
    }

    .note {
      margin-top: 15px;
      padding: 15px;

      background: rgba(129,140,248,.08);
      border: 1px solid rgba(129,140,248,.25);

      border-radius: 10px;

      color: rgba(255,255,255,.8);
    }

    ol {
      color: rgba(255,255,255,.8);
      padding-left: 25px;
    }

    li {
      margin-bottom: 8px;
    }

    .web-audit {
      display: inline-block;

      margin-top: 5px;
      padding: 10px 16px;

      border-radius: 8px;

      background: #4f46e5;
      color: white;

      text-decoration: none;
    }

    .web-audit:hover {
      text-decoration: none;
      opacity: .9;
    }

    @media (max-width: 600px) {

      body {
        padding: 20px 12px;
      }

      h1 {
        font-size: 1.7rem;
      }

      h2 {
        font-size: 1.2rem;
      }

      .endpoint {
        padding: 15px;
      }

      pre {
        font-size: 12px;
        padding: 12px;
      }
    }
  </style>
</head>

<body>

<div class="container">

  <h1>WebAudit API</h1>

  <div class="intro">

    <p>
      Analyze websites and retrieve performance, SEO,
      accessibility, best-practice and other website
      audit data.
    </p>

    <a
      class="web-audit"
      href="http://localhost:3000"
      target="_blank"
      rel="noopener noreferrer"
    >
      Open WebAudit
    </a>

  </div>


  <h2>Getting an API Key</h2>

  <p>
    You need a WebAudit account to obtain an API key.
  </p>

  <ol>

    <li>
      Open the
      <a
        href="http://localhost:3000"
        target="_blank"
        rel="noopener noreferrer"
      >
        WebAudit dashboard
      </a>.
    </li>

    <li>
      Create an account or sign in.
    </li>

    <li>
      Verify your email address.
    </li>

    <li>
      Open the <strong>API Keys</strong> section.
    </li>

    <li>
      Click <strong>Generate New Key</strong>.
    </li>

    <li>
      Copy your API key and store it securely.
    </li>

  </ol>


  <div class="note">

    <strong>Security:</strong>

    Keep your API key secret.
    Do not expose it in frontend JavaScript,
    public GitHub repositories, or URLs.

  </div>


  <h2>Authentication</h2>

  <p>
    Protected endpoints require an API key.
    Send the key using the HTTP Authorization header.
  </p>

  <pre>Authorization: Bearer YOUR_API_KEY</pre>

  <p>
    Replace <code>YOUR_API_KEY</code> with the key
    generated from your WebAudit dashboard.
  </p>


  <div class="endpoint">

    <h2>
      <span class="method">GET</span>
      /api/v1/health
    </h2>

    <p>
      Check whether the WebAudit API is running.
      This endpoint does not require an API key.
    </p>

    <pre>curl https://webauditapi.onrender.com/api/v1/health</pre>

  </div>


  <div class="endpoint">

    <h2>
      <span class="method">GET</span>
      /api/v1/history
    </h2>

    <p>
      Retrieve all website audits associated with
      your API key.
    </p>

    <pre>curl https://webauditapi.onrender.com/api/v1/history \
-H "Authorization: Bearer YOUR_API_KEY"</pre>

  </div>


  <div class="endpoint">

    <h2>
      <span class="method">GET</span>
      /api/v1/data
    </h2>

    <p>
      Retrieve the latest saved audit for a specific URL.
    </p>

    <p>
      Provide the URL using the
      <code>url</code> query parameter.
    </p>

    <pre>curl "https://webauditapi.onrender.com/api/v1/data?url=https://example.com" \
-H "Authorization: Bearer YOUR_API_KEY"</pre>

  </div>


  <div class="endpoint">

    <h2>
      <span class="method">POST</span>
      /api/v1/analyze
    </h2>

    <p>
      Run a new Lighthouse website audit.
      The result is also saved to your audit history.
    </p>

    <pre>curl -X POST https://webauditapi.onrender.com/api/v1/analyze \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_API_KEY" \
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
    },

    "CLS": {
      "Score": 0.98,
      "DisplayValue": "0.02"
    },

    "LCP": {
      "Score": 0.9,
      "DisplayValue": "1.8 s"
    },

    "FCP": {
      "Score": 0.95,
      "DisplayValue": "0.9 s"
    },

    "SpeedIndex": {
      "Score": 0.92,
      "DisplayValue": "1.2 s"
    },

    "StatusCode": 200,
    "StatusText": "OK",
    "Latency": "245.31"
  }
}</pre>

  </div>


  <h2>Available Endpoints</h2>

  <pre>
GET  /api/v1/health
GET  /api/v1/history
GET  /api/v1/data?url=https://example.com
POST /api/v1/analyze
  </pre>

</div>

</body>
</html>
`;