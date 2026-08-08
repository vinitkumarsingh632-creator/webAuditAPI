export const doc = `
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>WebAudit API Documentation</title>

<style>

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  background: #09090f;
  color: #e5e7eb;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  line-height: 1.6;
}

.container {
  width: min(1100px, calc(100% - 32px));
  margin: auto;
  padding: 50px 0 80px;
}

.hero {
  padding: 35px;
  margin-bottom: 35px;
  border: 1px solid #27273a;
  border-radius: 18px;
  background:
    linear-gradient(
      135deg,
      rgba(79, 70, 229, 0.18),
      rgba(17, 17, 29, 0.9)
    );
}

.logo {
  font-size: 34px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
}

.subtitle {
  color: #a1a1aa;
  max-width: 750px;
  font-size: 16px;
}

.web-audit {
  display: inline-block;
  margin-top: 20px;
  padding: 11px 18px;
  background: #4f46e5;
  color: white;
  text-decoration: none;
  border-radius: 9px;
  font-weight: 600;
}

.web-audit:hover {
  background: #6366f1;
}

h2 {
  margin-top: 50px;
  margin-bottom: 15px;
  color: white;
  font-size: 25px;
}

h3 {
  margin-top: 30px;
  color: white;
  font-size: 18px;
}

p {
  color: #a1a1aa;
}

ul,
ol {
  color: #c4c4cc;
}

li {
  margin: 8px 0;
}

code {
  padding: 3px 6px;
  border-radius: 5px;
  background: #181827;
  color: #a5b4fc;
  font-family: monospace;
}

pre {
  margin: 15px 0;
  padding: 18px;
  background: #050509;
  border: 1px solid #27273a;
  border-radius: 10px;
  overflow-x: auto;
  color: #d4d4d8;
  font-size: 14px;
  line-height: 1.6;
}

.endpoint {
  margin-top: 50px;
  padding-top: 15px;
  border-top: 1px solid #27273a;
}

.method {
  display: inline-block;
  padding: 4px 9px;
  margin-right: 8px;
  border-radius: 5px;
  color: white;
  font-size: 12px;
  font-weight: 800;
  font-family: monospace;
}

.get {
  background: #059669;
}

.post {
  background: #4f46e5;
}

.endpoint-name {
  color: #c4b5fd;
  font-family: monospace;
  font-size: 20px;
}

.endpoint-description {
  color: #a1a1aa;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: #11111b;
  border: 1px solid #27273a;
  border-radius: 10px;
  overflow: hidden;
}

th,
td {
  padding: 13px 15px;
  text-align: left;
  border-bottom: 1px solid #27273a;
}

th {
  background: #181827;
  color: white;
  font-weight: 700;
}

td {
  color: #c4c4cc;
}

tr:last-child td {
  border-bottom: none;
}

.notice {
  padding: 16px 18px;
  margin: 20px 0;
  border: 1px solid #37374c;
  border-radius: 10px;
  background: #11111b;
  color: #c4c4cc;
}

.warning {
  border-left: 4px solid #f59e0b;
}

.success {
  border-left: 4px solid #10b981;
}

.danger {
  border-left: 4px solid #ef4444;
}

.small {
  font-size: 13px;
  color: #71717a;
}

.score {
  color: #a5b4fc;
}

.footer {
  margin-top: 70px;
  padding-top: 25px;
  border-top: 1px solid #27273a;
  color: #71717a;
  text-align: center;
}

@media (max-width: 700px) {

  .container {
    width: min(100% - 20px, 1100px);
    padding-top: 20px;
  }

  .hero {
    padding: 22px;
  }

  .logo {
    font-size: 27px;
  }

  h2 {
    font-size: 21px;
  }

  pre {
    font-size: 12px;
  }

  table {
    display: block;
    overflow-x: auto;
  }

}

</style>

</head>

<body>

<div class="container">

<div class="hero">

<div class="logo">
WebAudit API
</div>

<p class="subtitle">
A website auditing API for analyzing performance,
SEO, accessibility, best practices and important
website performance metrics using Lighthouse and
Google PageSpeed.
</p>

<a
  class="web-audit"
  href="https://webauditapi.onrender.com"
  target="_blank"
  rel="noopener noreferrer"
>
Open WebAudit
</a>

</div>


<h2>Introduction</h2>

<p>
WebAudit allows developers to analyze websites through
a REST API and retrieve website audit information.
</p>

<p>
The API can analyze performance, SEO, accessibility,
best practices, Core Web Vitals, HTTP status information,
latency, resources and response headers.
</p>


<h2>Base URL</h2>

<pre>https://webauditapi.onrender.com</pre>


<h2>Getting Started</h2>

<ol>

<li>
Create a developer account using
<code>POST /api/v1/developers</code>.
</li>

<li>
Store the returned Developer ID and Developer Secret securely.
</li>

<li>
Generate an API key using
<code>POST /api/v1/keys</code>.
</li>

<li>
Store the API key securely.
</li>

<li>
Use the API key with
<code>/api/v1/analyze</code>
and other API-authenticated endpoints.
</li>

</ol>


<h2>Authentication</h2>

<p>
WebAudit uses two authentication mechanisms.
</p>

<h3>Developer Authentication</h3>

<p>
Developer-authenticated endpoints require:
</p>

<pre>
X-Developer-ID: YOUR_DEVELOPER_ID
X-Developer-Secret: YOUR_DEVELOPER_SECRET
</pre>

<p>
These credentials are used for developer account
operations and WebAudit UI operations.
</p>


<h3>API Key Authentication</h3>

<p>
Public API audit endpoints use an API key:
</p>

<pre>
X-API-Key: YOUR_API_KEY
</pre>

<p>
API keys generated by WebAudit use the
<code>wa_live_</code> prefix.
</p>


<div class="notice warning">

<strong>Security:</strong>

Never expose your Developer Secret or API key
in frontend JavaScript, public repositories,
URLs, screenshots or client-side applications.

</div>


<h2>Authentication Summary</h2>

<table>

<thead>

<tr>
<th>Endpoint</th>
<th>Method</th>
<th>Authentication</th>
</tr>

</thead>

<tbody>

<tr>
<td>/api/v1/health</td>
<td>GET</td>
<td>None</td>
</tr>

<tr>
<td>/api/v1/info</td>
<td>GET</td>
<td>None</td>
</tr>

<tr>
<td>/api/v1/limits</td>
<td>GET</td>
<td>None</td>
</tr>

<tr>
<td>/api/v1/developers</td>
<td>POST</td>
<td>None</td>
</tr>

<tr>
<td>/api/v1/keys</td>
<td>POST</td>
<td>Developer credentials</td>
</tr>

<tr>
<td>/api/v1/keys</td>
<td>GET</td>
<td>Developer credentials</td>
</tr>

<tr>
<td>/api/v1/analyze</td>
<td>POST</td>
<td>X-API-Key</td>
</tr>

<tr>
<td>/api/v1/history</td>
<td>GET</td>
<td>X-API-Key</td>
</tr>

<tr>
<td>/ui/analyze</td>
<td>POST</td>
<td>Developer credentials</td>
</tr>

<tr>
<td>/ui/history</td>
<td>GET</td>
<td>Developer credentials</td>
</tr>

</tbody>

</table>


<h2 class="endpoint">

<span class="method get">GET</span>

<span class="endpoint-name">
/api/v1/health
</span>

</h2>

<p class="endpoint-description">
Check whether the WebAudit API is running.
This endpoint does not require authentication.
</p>

<h3>Request</h3>

<pre>
curl "https://webauditapi.onrender.com/api/v1/health"
</pre>

<h3>Example Response</h3>

<pre>
{
  "status": true,
  "service": "WebAudit API",
  "version": "1.0.0",
  "uptime": 123.45,
  "timestamp": "2026-08-08T12:00:00.000Z"
}
</pre>


<h2 class="endpoint">

<span class="method get">GET</span>

<span class="endpoint-name">
/api/v1/info
</span>

</h2>

<p class="endpoint-description">
Retrieve information about the WebAudit API
and its available endpoints.
</p>

<h3>Request</h3>

<pre>
curl "https://webauditapi.onrender.com/api/v1/info"
</pre>

<h3>Example Response</h3>

<pre>
{
  "status": true,
  "name": "WebAudit API",
  "version": "1.0.0",
  "description": "Website performance, SEO, accessibility and best-practice auditing API.",
  "endpoints": {
    "health": "GET /api/v1/health",
    "info": "GET /api/v1/info",
    "limits": "GET /api/v1/limits",
    "history": "GET /api/v1/history",
    "analyze": "POST /api/v1/analyze"
  },
  "authentication": "API key"
}
</pre>


<h2 class="endpoint">

<span class="method get">GET</span>

<span class="endpoint-name">
/api/v1/limits
</span>

</h2>

<p class="endpoint-description">
Retrieve the request limits configured for the API.
</p>

<h3>Request</h3>

<pre>
curl "https://webauditapi.onrender.com/api/v1/limits"
</pre>

<h3>Current Limits</h3>

<table>

<thead>
<tr>
<th>Limiter</th>
<th>Window</th>
<th>Maximum Requests</th>
</tr>
</thead>

<tbody>

<tr>
<td>General</td>
<td>15 seconds</td>
<td>5</td>
</tr>

<tr>
<td>Developer API</td>
<td>60 seconds</td>
<td>30</td>
</tr>

</tbody>

</table>


<h2 class="endpoint">

<span class="method post">POST</span>

<span class="endpoint-name">
/api/v1/developers
</span>

</h2>

<p class="endpoint-description">
Create a new developer account.
</p>

<h3>Request Headers</h3>

<table>

<tr>
<th>Header</th>
<th>Required</th>
</tr>

<tr>
<td>Content-Type: application/json</td>
<td>Yes</td>
</tr>

</table>

<h3>Request Body</h3>

<pre>
{
  "name": "Your Name"
}
</pre>

<h3>cURL</h3>

<pre>
curl -X POST "https://webauditapi.onrender.com/api/v1/developers" \
-H "Content-Type: application/json" \
-d '{"name":"Your Name"}'
</pre>

<h3>Successful Response</h3>

<pre>
{
  "status": true,
  "message": "Developer account created.",
  "developer": {
    "id": "YOUR_DEVELOPER_ID",
    "name": "Your Name"
  },
  "secret": "YOUR_DEVELOPER_SECRET"
}
</pre>

<div class="notice warning">

<strong>Important:</strong>

Store the returned Developer Secret securely.

</div>


<h2 class="endpoint">

<span class="method post">POST</span>

<span class="endpoint-name">
/api/v1/keys
</span>

</h2>

<p class="endpoint-description">
Generate an API key for the authenticated developer.
If an existing key is present, the key record is updated
rather than creating an unlimited number of API-key records.
</p>

<h3>Headers</h3>

<pre>
X-Developer-ID: YOUR_DEVELOPER_ID
X-Developer-Secret: YOUR_DEVELOPER_SECRET
</pre>

<h3>cURL</h3>

<pre>
curl -X POST "https://webauditapi.onrender.com/api/v1/keys" \
-H "X-Developer-ID: YOUR_DEVELOPER_ID" \
-H "X-Developer-Secret: YOUR_DEVELOPER_SECRET"
</pre>

<h3>Successful Response</h3>

<pre>
{
  "status": true,
  "message": "API key generated successfully.",
  "apiKey": "wa_live_YOUR_API_KEY",
  "id": "YOUR_API_KEY_DOCUMENT_ID"
}
</pre>


<h2 class="endpoint">

<span class="method get">GET</span>

<span class="endpoint-name">
/api/v1/keys
</span>

</h2>

<p class="endpoint-description">
Retrieve the currently stored API key for the authenticated
developer.
</p>

<h3>Headers</h3>

<pre>
X-Developer-ID: YOUR_DEVELOPER_ID
X-Developer-Secret: YOUR_DEVELOPER_SECRET
</pre>

<h3>cURL</h3>

<pre>
curl "https://webauditapi.onrender.com/api/v1/keys" \
-H "X-Developer-ID: YOUR_DEVELOPER_ID" \
-H "X-Developer-Secret: YOUR_DEVELOPER_SECRET"
</pre>


<h2 class="endpoint">

<span class="method post">POST</span>

<span class="endpoint-name">
/api/v1/analyze
</span>

</h2>

<p class="endpoint-description">
Run a website audit using Lighthouse/PageSpeed.
The resulting audit is saved to the API audit history.
</p>

<h3>Authentication</h3>

<pre>
X-API-Key: YOUR_API_KEY
</pre>

<h3>Request Headers</h3>

<table>

<tr>
<th>Header</th>
<th>Required</th>
<th>Description</th>
</tr>

<tr>
<td>Content-Type</td>
<td>Yes</td>
<td>application/json</td>
</tr>

<tr>
<td>X-API-Key</td>
<td>Yes</td>
<td>Your WebAudit API key</td>
</tr>

</table>

<h3>Request Body</h3>

<pre>
{
  "url": "https://example.com"
}
</pre>

<h3>cURL</h3>

<pre>
curl -X POST "https://webauditapi.onrender.com/api/v1/analyze" \
-H "Content-Type: application/json" \
-H "X-API-Key: YOUR_API_KEY" \
-d '{"url":"https://example.com"}'
</pre>

<h3>Successful Response</h3>

<pre>
{
  "status": true,
  "data": {
    "URL": "https://example.com",
    "Timestamp": "2026-08-08T12:00:00.000Z",
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
      "Score": 0.90
    },
    "CLS": {
      "Score": 0.98,
      "DisplayValue": "0.02"
    },
    "LCP": {
      "Score": 0.90,
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
    "Latency": "245.31",
    "Improvements": [],
    "Resources": [],
    "Headers": {
      "contentType": "text/html",
      "cacheControl": null,
      "contentEncoding": null,
      "contentLength": null,
      "server": "example"
    }
  }
}
</pre>


<h2>Audit Result Fields</h2>

<table>

<thead>

<tr>
<th>Field</th>
<th>Description</th>
</tr>

</thead>

<tbody>

<tr>
<td>URL</td>
<td>The website URL that was analyzed.</td>
</tr>

<tr>
<td>Timestamp</td>
<td>Time at which the audit was generated.</td>
</tr>

<tr>
<td>Performance</td>
<td>Lighthouse performance score.</td>
</tr>

<tr>
<td>SEO</td>
<td>Lighthouse SEO score.</td>
</tr>

<tr>
<td>Accessibility</td>
<td>Lighthouse accessibility score.</td>
</tr>

<tr>
<td>Best_Practices</td>
<td>Lighthouse best-practices score.</td>
</tr>

<tr>
<td>LCP</td>
<td>Largest Contentful Paint metric.</td>
</tr>

<tr>
<td>FCP</td>
<td>First Contentful Paint metric.</td>
</tr>

<tr>
<td>CLS</td>
<td>Cumulative Layout Shift metric.</td>
</tr>

<tr>
<td>SpeedIndex</td>
<td>Speed Index metric.</td>
</tr>

<tr>
<td>StatusCode</td>
<td>HTTP status code returned by the website.</td>
</tr>

<tr>
<td>StatusText</td>
<td>HTTP status text.</td>
</tr>

<tr>
<td>Latency</td>
<td>Time taken to fetch the target website.</td>
</tr>

<tr>
<td>Improvements</td>
<td>Performance audits that can potentially be improved.</td>
</tr>

<tr>
<td>Resources</td>
<td>Resource information returned by Lighthouse.</td>
</tr>

<tr>
<td>Headers</td>
<td>Selected HTTP response headers.</td>
</tr>

</tbody>

</table>


<h2 class="endpoint">

<span class="method get">GET</span>

<span class="endpoint-name">
/api/v1/history
</span>

</h2>

<p class="endpoint-description">
Retrieve audits performed using your API key.
</p>

<h3>Headers</h3>

<pre>
X-API-Key: YOUR_API_KEY
</pre>

<h3>cURL</h3>

<pre>
curl "https://webauditapi.onrender.com/api/v1/history" \
-H "X-API-Key: YOUR_API_KEY"
</pre>

<h3>Example Response</h3>

<pre>
{
  "status": true,
  "count": 2,
  "history": [
    {
      "URL": "https://example.com",
      "StatusCode": 200,
      "Performance": {
        "Score": 0.92
      }
    }
  ]
}
</pre>


<h2 class="endpoint">

<span class="method post">POST</span>

<span class="endpoint-name">
/ui/analyze
</span>

</h2>

<p class="endpoint-description">
Run an audit from the WebAudit dashboard.
The result is saved to the developer's UI audit history.
</p>

<h3>Headers</h3>

<pre>
Content-Type: application/json
X-Developer-ID: YOUR_DEVELOPER_ID
X-Developer-Secret: YOUR_DEVELOPER_SECRET
</pre>

<h3>Request Body</h3>

<pre>
{
  "url": "https://example.com"
}
</pre>

<h3>cURL</h3>

<pre>
curl -X POST "https://webauditapi.onrender.com/ui/analyze" \
-H "Content-Type: application/json" \
-H "X-Developer-ID: YOUR_DEVELOPER_ID" \
-H "X-Developer-Secret: YOUR_DEVELOPER_SECRET" \
-d '{"url":"https://example.com"}'
</pre>


<h2 class="endpoint">

<span class="method get">GET</span>

<span class="endpoint-name">
/ui/history
</span>

</h2>

<p class="endpoint-description">
Retrieve audits performed through the WebAudit dashboard.
</p>

<h3>Headers</h3>

<pre>
X-Developer-ID: YOUR_DEVELOPER_ID
X-Developer-Secret: YOUR_DEVELOPER_SECRET
</pre>

<h3>cURL</h3>

<pre>
curl "https://webauditapi.onrender.com/ui/history" \
-H "X-Developer-ID: YOUR_DEVELOPER_ID" \
-H "X-Developer-Secret: YOUR_DEVELOPER_SECRET"
</pre>


<h2>Error Handling</h2>

<p>
WebAudit returns JSON responses when an API request fails.
The response contains a <code>status</code> field and
a descriptive <code>message</code>.
</p>

<h3>Missing URL</h3>

<pre>
{
  "status": false,
  "message": "URL is required."
}
</pre>

<h3>Invalid URL</h3>

<pre>
{
  "status": false,
  "message": "Invalid URL."
}
</pre>

<h3>Unsupported Protocol</h3>

<pre>
{
  "status": false,
  "message": "Only HTTP and HTTPS URLs are supported."
}
</pre>

<h3>Authentication Failure</h3>

<pre>
{
  "status": false,
  "message": "Authentication failed."
}
</pre>

<h3>Rate Limit</h3>

<pre>
{
  "status": false,
  "message": "Too many requests. Try again later."
}
</pre>


<h2>HTTP Status Codes</h2>

<table>

<thead>

<tr>
<th>Status</th>
<th>Meaning</th>
</tr>

</thead>

<tbody>

<tr>
<td>200</td>
<td>Request completed successfully.</td>
</tr>

<tr>
<td>201</td>
<td>Developer account created successfully.</td>
</tr>

<tr>
<td>400</td>
<td>Invalid request or URL.</td>
</tr>

<tr>
<td>401</td>
<td>Authentication failed or credentials are missing.</td>
</tr>

<tr>
<td>404</td>
<td>Requested resource was not found.</td>
</tr>

<tr>
<td>429</td>
<td>Rate limit exceeded.</td>
</tr>

<tr>
<td>500</td>
<td>Internal server error.</td>
</tr>

</tbody>

</table>


<h2>Rate Limits</h2>

<p>
WebAudit currently applies two rate limiters.
</p>

<table>

<thead>

<tr>
<th>Limiter</th>
<th>Window</th>
<th>Limit</th>
</tr>

</thead>

<tbody>

<tr>
<td>General</td>
<td>15 seconds</td>
<td>5 requests</td>
</tr>

<tr>
<td>Developer API</td>
<td>60 seconds</td>
<td>30 requests</td>
</tr>

</tbody>

</table>

<p>
The developer API limiter applies to routes under
<code>/api/v1</code>.
</p>


<h2>Supported URLs</h2>

<p>
Analyze endpoints accept HTTP and HTTPS URLs.
</p>

<pre>
https://example.com
</pre>

<p>
Other protocols are rejected.
</p>


<h2>Example Integration Flow</h2>

<h3>Step 1 — Create Developer Account</h3>

<pre>
curl -X POST "https://webauditapi.onrender.com/api/v1/developers" \
-H "Content-Type: application/json" \
-d '{"name":"Your Name"}'
</pre>


<h3>Step 2 — Generate API Key</h3>

<pre>
curl -X POST "https://webauditapi.onrender.com/api/v1/keys" \
-H "X-Developer-ID: YOUR_DEVELOPER_ID" \
-H "X-Developer-Secret: YOUR_DEVELOPER_SECRET"
</pre>


<h3>Step 3 — Analyze Website</h3>

<pre>
curl -X POST "https://webauditapi.onrender.com/api/v1/analyze" \
-H "Content-Type: application/json" \
-H "X-API-Key: YOUR_API_KEY" \
-d '{"url":"https://example.com"}'
</pre>


<h3>Step 4 — Retrieve History</h3>

<pre>
curl "https://webauditapi.onrender.com/api/v1/history" \
-H "X-API-Key: YOUR_API_KEY"
</pre>


<h2>Security</h2>

<div class="notice danger">

<strong>Never commit secrets to GitHub.</strong>

</div>

<p>
The following values should remain private:
</p>

<ul>

<li>MongoDB connection string</li>

<li>PageSpeed API key</li>

<li>API key encryption secret</li>

<li>Developer Secret</li>

<li>Any other server-side credentials</li>

</ul>

<p>
Use environment variables for server-side secrets.
</p>


<h2>API Key Handling</h2>

<p>
API keys should be treated as credentials.
Anyone who obtains an active API key may be able
to access API endpoints associated with that key.
</p>

<p>
Store API keys securely and avoid putting them
inside URLs or public source code.
</p>


<h2>WebAudit Dashboard</h2>

<p>
The WebAudit dashboard provides a graphical interface
for submitting websites and viewing audit results.
</p>

<a
  class="web-audit"
  href="https://web-audit-api-kappa.vercel.app"
  target="_blank"
  rel="noopener noreferrer"
>
Open Dashboard
</a>


<div class="footer">

WebAudit API · Website Performance & Audit Platform

</div>

</div>

</body>

</html>
`;