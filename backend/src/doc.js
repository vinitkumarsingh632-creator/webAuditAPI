export const doc = `

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
    Create a developer account using
    <code>POST /api/v1/developers</code>.
  </li>

  <li>
    Store your Developer ID and Developer Secret securely.
  </li>

  <li>
    Open the <strong>API Keys</strong> section in WebAudit.
  </li>

  <li>
    Generate an API key.
  </li>

  <li>
    Copy your API key and store it securely.
  </li>

</ol>

<p>
  Developer authentication uses your
  <code>X-Developer-ID</code> and
  <code>X-Developer-Secret</code>.
</p>

<p>
  API requests that access developer resources
  use the <code>X-API-Key</code> header.
</p>

<h2>Security</h2>

<p>
  Keep your Developer Secret and API key secret.
  Never expose them in frontend JavaScript,
  public GitHub repositories, URLs, or client-side code.
</p>

<h2>GET /api/v1/health</h2>

<p>
  Check whether the WebAudit API is running.
  This endpoint does not require authentication.
</p>

<pre>curl "https://webauditapi.onrender.com/api/v1/health"</pre>

<h2>GET /api/v1/info</h2>

<p>
  Retrieve information about the WebAudit API
  and its available endpoints.
</p>

<pre>curl "https://webauditapi.onrender.com/api/v1/info"</pre>

<h2>GET /api/v1/limits</h2>

<p>
  Retrieve the API request limits.
</p>

<pre>curl "https://webauditapi.onrender.com/api/v1/limits"</pre>

<h2>POST /api/v1/developers</h2>

<p>
  Create a developer account.
</p>

<h3>Request</h3>

<pre>curl -X POST "https://webauditapi.onrender.com/api/v1/developers" \
-H "Content-Type: application/json" \
-d '{"name":"Your Name"}'</pre>

<h3>Request Body</h3>

<pre>{
  "name": "Your Name"
}</pre>

<h3>Response</h3>

<pre>{
  "status": true,
  "message": "Developer account created.",
  "developer": {
    "id": "YOUR_DEVELOPER_ID",
    "name": "Your Name"
  },
  "secret": "YOUR_DEVELOPER_SECRET"
}</pre>

<p>
  Save the returned Developer ID and Developer Secret.
  The Developer Secret is required for developer-authenticated requests.
</p>

<h2>POST /api/v1/keys</h2>

<p>
  Generate a new API key for your developer account.
  If an API key already exists, the existing API-key record
  is updated with the new key.
</p>

<h3>Request</h3>

<pre>curl -X POST "https://webauditapi.onrender.com/api/v1/keys" \
-H "X-Developer-ID: YOUR_DEVELOPER_ID" \
-H "X-Developer-Secret: YOUR_DEVELOPER_SECRET"</pre>

<h3>Response</h3>

<pre>{
  "status": true,
  "message": "API key generated successfully.",
  "apiKey": "wa_live_YOUR_API_KEY",
  "id": "YOUR_API_KEY_DOCUMENT_ID"
}</pre>

<h2>GET /api/v1/keys</h2>

<p>
  Retrieve your currently active API key.
  Developer authentication is required.
</p>

<h3>Request</h3>

<pre>curl "https://webauditapi.onrender.com/api/v1/keys" \
-H "X-Developer-ID: YOUR_DEVELOPER_ID" \
-H "X-Developer-Secret: YOUR_DEVELOPER_SECRET"</pre>

<h2>POST /api/v1/analyze</h2>

<p>
  Run a new Lighthouse website audit.
  The result is saved to your API audit history.
</p>

<h3>Request</h3>

<pre>curl -X POST "https://webauditapi.onrender.com/api/v1/analyze" \
-H "Content-Type: application/json" \
-H "X-API-Key: YOUR_API_KEY" \
-d '{"url":"https://example.com"}'</pre>

<h3>Request Body</h3>

<pre>{
  "url": "https://example.com"
}</pre>

<h3>Response</h3>

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
    "StatusCode": 200,
    "StatusText": "OK",
    "Latency": "245.31"
  }
}</pre>

<h2>GET /api/v1/history</h2>

<p>
  Retrieve website audits performed using
  your API key.
</p>

<h3>Request</h3>

<pre>curl "https://webauditapi.onrender.com/api/v1/history" \
-H "X-API-Key: YOUR_API_KEY"</pre>

<h2>GET /api/v1/data</h2>

<p>
  Retrieve the latest saved audit for a specific URL.
  The URL must be provided using the
  <code>url</code> query parameter.
</p>

<h3>Request</h3>

<pre>curl "https://webauditapi.onrender.com/api/v1/data?url=https://example.com" \
-H "X-API-Key: YOUR_API_KEY"</pre>

<h2>POST /ui/analyze</h2>

<p>
  Analyze a website through the WebAudit UI API.
  Developer authentication is required.
  The result is saved to the developer's UI history.
</p>

<h3>Request</h3>

<pre>curl -X POST "https://webauditapi.onrender.com/ui/analyze" \
-H "Content-Type: application/json" \
-H "X-Developer-ID: YOUR_DEVELOPER_ID" \
-H "X-Developer-Secret: YOUR_DEVELOPER_SECRET" \
-d '{"url":"https://example.com"}'</pre>

<h3>Request Body</h3>

<pre>{
  "url": "https://example.com"
}</pre>

<h2>GET /ui/history</h2>

<p>
  Retrieve audits performed through the WebAudit UI.
</p>

<h3>Request</h3>

<pre>curl "https://webauditapi.onrender.com/ui/history" \
-H "X-Developer-ID: YOUR_DEVELOPER_ID" \
-H "X-Developer-Secret: YOUR_DEVELOPER_SECRET"</pre>

<h2>Authentication Summary</h2>

<table>
  <thead>
    <tr>
      <th>Endpoint</th>
      <th>Authentication</th>
    </tr>
  </thead>

  <tbody>

    <tr>
      <td>/api/v1/health</td>
      <td>None</td>
    </tr>

    <tr>
      <td>/api/v1/info</td>
      <td>None</td>
    </tr>

    <tr>
      <td>/api/v1/limits</td>
      <td>None</td>
    </tr>

    <tr>
      <td>/api/v1/developers</td>
      <td>None</td>
    </tr>

    <tr>
      <td>/api/v1/keys</td>
      <td>Developer ID + Developer Secret</td>
    </tr>

    <tr>
      <td>/api/v1/analyze</td>
      <td>X-API-Key</td>
    </tr>

    <tr>
      <td>/api/v1/history</td>
      <td>X-API-Key</td>
    </tr>

    <tr>
      <td>/api/v1/data</td>
      <td>X-API-Key</td>
    </tr>

    <tr>
      <td>/ui/analyze</td>
      <td>Developer ID + Developer Secret</td>
    </tr>

    <tr>
      <td>/ui/history</td>
      <td>Developer ID + Developer Secret</td>
    </tr>

  </tbody>
</table>

<h2>Request Limits</h2>

<p>
  General requests are limited to
  <strong>5 requests per 15 seconds</strong>.
</p>

<p>
  Developer API requests are limited to
  <strong>30 requests per 60 seconds</strong>.
</p>

<h2>Supported URL Format</h2>

<p>
  The analyze endpoints accept HTTP and HTTPS URLs.
</p>

<pre>https://example.com</pre>

<p>
  Other protocols are rejected.
</p>

<h2>API Audit Data</h2>

<p>
  An audit can contain performance,
  SEO, accessibility, best-practice,
  LCP, FCP, CLS, Speed Index,
  HTTP status code, latency,
  improvements, resources, and response headers.
</p>

<h2>API Key Security</h2>

<p>
  API keys are hashed for authentication
  and encrypted for secure retrieval.
</p>

<p>
  Never commit API keys, Developer Secrets,
  database credentials, or encryption secrets
  to a public repository.
</p>

`;