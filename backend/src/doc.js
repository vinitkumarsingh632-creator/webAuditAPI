export const doc=`
<!DOCTYPE html>
<html>
<head>
  <title>WebAudit API Documentation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

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

    p {
      color: rgba(255,255,255,.75);
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
      color: #ddd;
    }

    code {
      color: #a5b4fc;
    }

    .note {
      background: rgba(129,140,248,.1);
      border: 1px solid rgba(129,140,248,.3);
      padding: 15px;
      border-radius: 10px;
      margin: 15px 0;
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
    Analyze websites and retrieve performance, SEO,
    accessibility and best-practice data.
  </p>


  <h2>Getting an API Key</h2>

  <p>
    To use the WebAudit API, you first need a WebAudit account.
  </p>

  <ol>
    <li>Create an account on WebAudit.</li>
    <li>Verify your email address.</li>
    <li>Open the <strong>API Keys</strong> section in your dashboard.</li>
    <li>Click <strong>Generate New Key</strong>.</li>
    <li>Copy your API key and store it securely.</li>
  </ol>

  <div class="note">
    <strong>Important:</strong>
    Keep your API key secret. Do not put it in
    frontend JavaScript, public GitHub repositories,
    or URLs.
  </div>


  <h2>Authentication</h2>

  <p>
    All protected endpoints require your API key
    in the Authorization header.
  </p>

  <pre>Authorization: Bearer YOUR_API_KEY</pre>

  <p>
    Replace <code>YOUR_API_KEY</code> with the API key
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

    <pre>curl https://webauditapi.onrender.com/api/v1/history \\
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
      Provide the URL using the <code>url</code> query parameter.
    </p>

    <pre>curl "https://webauditapi.onrender.com/api/v1/data?url=https://example.com" \\
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

    <pre>curl -X POST https://webauditapi.onrender.com/api/v1/analyze \\
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


  <h2>API Endpoints</h2>

  <pre>
GET  /api/v1/health
GET  /api/v1/history
GET  /api/v1/data?url=https://example.com
POST /api/v1/analyze
  </pre>

</div>

</body>
</html>
`