export const doc=`
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
  `