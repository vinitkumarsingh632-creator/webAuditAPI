export const doc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>WebAudit API Documentation</title>

  <style>
    body {
      margin: 0;
      padding: 40px 20px;
      font-family: Arial, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      line-height: 1.6;
    }

    .container {
      max-width: 900px;
      margin: auto;
    }

    h1 {
      color: white;
      margin-bottom: 8px;
    }

    h2 {
      margin-top: 45px;
      color: white;
    }

    h3 {
      margin-top: 30px;
      color: #cbd5e1;
    }

    p {
      color: #cbd5e1;
    }

    a {
      color: #60a5fa;
    }

    .web-audit {
      display: inline-block;
      margin: 15px 0 30px;
      padding: 10px 16px;
      border-radius: 8px;
      background: #2563eb;
      color: white;
      text-decoration: none;
    }

    .endpoint {
      margin-top: 30px;
      padding: 22px;
      border: 1px solid #334155;
      border-radius: 12px;
      background: #111827;
    }

    .method {
      display: inline-block;
      padding: 4px 8px;
      margin-right: 8px;
      border-radius: 5px;
      background: #2563eb;
      color: white;
      font-size: 13px;
      font-weight: bold;
    }

    code {
      padding: 2px 5px;
      border-radius: 4px;
      background: #1e293b;
      color: #93c5fd;
    }

    pre {
      overflow-x: auto;
      padding: 16px;
      border-radius: 8px;
      background: #020617;
      color: #dbeafe;
      border: 1px solid #1e293b;
    }

    .warning {
      padding: 15px;
      border-left: 4px solid #f59e0b;
      background: #1c1917;
      color: #fed7aa;
      border-radius: 5px;
    }

    .success {
      padding: 15px;
      border-left: 4px solid #22c55e;
      background: #052e16;
      color: #bbf7d0;
      border-radius: 5px;
    }

    li {
      margin: 8px 0;
    }
  </style>
</head>

<body>

<div class="container">

  <h1>WebAudit API</h1>

  <p>
    Analyze websites and retrieve performance, SEO,
    accessibility, best-practice and other website
    audit data.
  </p>

  <a
    class="web-audit"
    href="https://web-audit-api-kappa.vercel.app"
    target="_blank"
    rel="noopener noreferrer"
  >
    Open WebAudit
  </a>


  <h2>Getting Started</h2>

  <ol>
    <li>
      Open the
      <a
        href="https://web-audit-api-kappa.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
      >
        WebAudit dashboard
      </a>.
    </li>

    <li>
      Create a developer account.
    </li>

    <li>
      Store your Developer ID and Developer Secret securely.
    </li>

    <li>
      Open the <strong>API Keys</strong> section.
    </li>

    <li>
      Generate an API key.
    </li>

    <li>
      Copy your API key and store it securely.
    </li>
  </ol>


  <div class="warning">
    <strong>Security:</strong>
    Keep your API key secret.
    Do not expose it in frontend JavaScript,
    public GitHub repositories, or URLs.
  </div>


  <h2>Authentication</h2>

  <p>
    Developer endpoints use two headers:
  </p>

  <pre>X-Developer-ID: YOUR_DEVELOPER_ID
X-Developer-Secret: YOUR_DEVELOPER_SECRET</pre>

  <p>
    API endpoints that perform audits or access
    API history use:
  </p>

  <pre>X-API-Key: wa_live_YOUR_API_KEY</pre>


  <h2>Endpoints</h2>


  <div class="endpoint">

    <h2>
      <span class="method">GET</span>
      /api/v1/health
    </h2>

    <p>
      Check whether the WebAudit API is running.
      This endpoint does not require authentication.
    </p>

    <pre>curl https://webauditapi.onrender.com/api/v1/health</pre>

  </div>


  <div class="endpoint">

    <h2>
      <span class="method">GET</span>
      /api/v1/info
    </h2>

    <p>
      Retrieve information about the WebAudit API
      and its available endpoints.
    </p>

    <pre>curl https://webauditapi.onrender.com/api/v1/info</pre>

  </div>


  <div class="endpoint">

    <h2>
      <span class="method">GET</span>
      /api/v1/limits
    </h2>

    <p>
      Retrieve the API request limits.
    </p>

    <pre>curl https://webauditapi.onrender.com/api/v1/limits</pre>

  </div>


  <div class="endpoint">

    <h2>
      <span class="method">POST</span>
      /api/v1/developers
    </h2>

    <p>
      Create a developer account.
    </p>

    <pre>curl -X POST https://webauditapi.onrender.com/api/v1/developers \\
-H "Content-Type: application/json" \\
-d '{"name":"Your Name"}'</pre>

  </div>


  <div class="endpoint">

    <h2>
      <span class="method">POST</span>
      /api/v1/keys
    </h2>

    <p>
      Generate or replace the API key associated
      with your developer account.
    </p>

    <pre>curl -X POST https://webauditapi.onrender.com/api/v1/keys \\
-H "X-Developer-ID: YOUR_DEVELOPER_ID" \\
-H "X-Developer-Secret: YOUR_DEVELOPER_SECRET"</pre>

  </div>


  <div class="endpoint">

    <h2>
      <span class="method">GET</span>
      /api/v1/keys
    </h2>

    <p>
      Retrieve your currently active API key.
    </p>

    <pre>curl https://webauditapi.onrender.com/api/v1/keys \\
-H "X-Developer-ID: YOUR_DEVELOPER_ID" \\
-H "X-Developer-Secret: YOUR_DEVELOPER_SECRET"</pre>

  </div>


  <div class="endpoint">

    <h2>
      <span class="method">POST</span>
      /api/v1/analyze
    </h2>

    <p>
      Run a new Lighthouse website audit.
      The result is also saved to your API audit history.
    </p>

    <pre>curl -X POST https://webauditapi.onrender.com/api/v1/analyze \\
-H "Content-Type: application/json" \\
-H "X-API-Key: YOUR_API_KEY" \\
-d '{"url":"https://example.com"}'</pre>

  </div>


  <div class="endpoint">

    <h2>
      <span class="method">GET</span>
      /api/v1/history
    </h2>

    <p>
      Retrieve website audits performed using
      your API key.
    </p>

    <pre>curl https://webauditapi.onrender.com/api/v1/history \\
-H "X-API-Key: YOUR_API_KEY"</pre>

  </div>


  <div class="endpoint">

    <h2>
      <span class="method">POST</span>
      /ui/analyze
    </h2>

    <p>
      Analyze a website from the WebAudit UI.
      The result is saved to the developer's UI history.
    </p>

    <pre>curl -X POST https://webauditapi.onrender.com/ui/analyze \\
-H "Content-Type: application/json" \\
-H "X-Developer-ID: YOUR_DEVELOPER_ID" \\
-H "X-Developer-Secret: YOUR_DEVELOPER_SECRET" \\
-d '{"url":"https://example.com"}'</pre>

  </div>


  <div class="endpoint">

    <h2>
      <span class="method">GET</span>
      /ui/history
    </h2>

    <p>
      Retrieve audits performed through the WebAudit UI.
    </p>

    <pre>curl https://webauditapi.onrender.com/ui/history \\
-H "X-Developer-ID: YOUR_DEVELOPER_ID" \\
-H "X-Developer-Secret: YOUR_DEVELOPER_SECRET"</pre>

  </div>


  <h2>Example Response</h2>

  <pre>{
  "status": true,
  "data": {
    "URL": "https://example.com",
    "StatusCode": 200,
    "StatusText": "OK",
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
    "Latency": "245.31"
  }
}</pre>


  <h2>Rate Limits</h2>

  <p>
    General requests are limited to
    <strong>5 requests per 15 seconds</strong>.
  </p>

  <p>
    Developer API requests are limited to
    <strong>30 requests per 60 seconds</strong>.
  </p>


  <h2>API Key Security</h2>

  <p>
    API keys are hashed for authentication and
    encrypted for secure retrieval.
  </p>

  <div class="success">
    Never commit your API key, developer secret,
    database credentials, or encryption secret
    to a public repository.
  </div>


  <h2>Documentation</h2>

  <p>
    This documentation is available at:
  </p>

  <pre>https://webauditapi.onrender.com/docs</pre>

</div>

</body>
</html>
`;