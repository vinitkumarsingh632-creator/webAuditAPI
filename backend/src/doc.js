export const doc = `
<!DOCTYPE html>
<html lang="en">

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
      padding: 40px 20px;
      background: #080811;
      color: #e5e7eb;
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }

    .container {
      max-width: 1000px;
      margin: auto;
    }

    h1 {
      color: white;
      margin-bottom: 10px;
    }

    h2 {
      margin-top: 45px;
      color: white;
    }

    p {
      color: #a1a1aa;
    }

    .web-audit {
      display: inline-block;
      margin: 20px 0 30px;
      padding: 10px 18px;
      background: #4f46e5;
      color: white;
      text-decoration: none;
      border-radius: 8px;
    }

    .web-audit:hover {
      background: #6366f1;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 25px;
      background: #11111d;
      border-radius: 10px;
      overflow: hidden;
    }

    th,
    td {
      padding: 14px;
      text-align: left;
      border-bottom: 1px solid #27273a;
    }

    th {
      background: #181827;
      color: white;
    }

    td {
      color: #c4c4d0;
    }

    tr:last-child td {
      border-bottom: none;
    }

    code {
      padding: 3px 6px;
      border-radius: 5px;
      background: #181827;
      color: #a5b4fc;
    }

    pre {
      padding: 18px;
      background: #050509;
      border: 1px solid #27273a;
      border-radius: 8px;
      overflow-x: auto;
      color: #d4d4d8;
    }

    .method {
      display: inline-block;
      padding: 3px 8px;
      margin-right: 8px;
      border-radius: 5px;
      background: #4f46e5;
      color: white;
      font-size: 13px;
      font-weight: bold;
    }

    .endpoint {
      color: #a5b4fc;
      font-family: monospace;
    }
  </style>
</head>

<body>

<div class="container">

  <h1>WebAudit API Documentation</h1>

  <p>
    Analyze websites and retrieve performance, SEO,
    accessibility, best-practice and other website
    audit data.
  </p>

  <a
    class="web-audit"
    href="https://webauditapi.onrender.com"
    target="_blank"
    rel="noopener noreferrer"
  >
    Open WebAudit
  </a>

  <h2>Authentication</h2>

  <p>
    WebAudit uses different authentication methods
    depending on the endpoint.
  </p>

  <table>
    <thead>
      <tr>
        <th>Endpoint</th>
        <th>Authentication</th>
      </tr>
    </thead>

    <tbody>

      <tr>
        <td class="endpoint">/api/v1/health</td>
        <td>None</td>
      </tr>

      <tr>
        <td class="endpoint">/api/v1/info</td>
        <td>None</td>
      </tr>

      <tr>
        <td class="endpoint">/api/v1/limits</td>
        <td>None</td>
      </tr>

      <tr>
        <td class="endpoint">/api/v1/developers</td>
        <td>None</td>
      </tr>

      <tr>
        <td class="endpoint">/api/v1/keys</td>
        <td>Developer ID + Developer Secret</td>
      </tr>

      <tr>
        <td class="endpoint">/api/v1/analyze</td>
        <td>X-API-Key</td>
      </tr>

      <tr>
        <td class="endpoint">/api/v1/history</td>
        <td>X-API-Key</td>
      </tr>

      <tr>
        <td class="endpoint">/api/v1/data</td>
        <td>X-API-Key</td>
      </tr>

      <tr>
        <td class="endpoint">/ui/analyze</td>
        <td>Developer ID + Developer Secret</td>
      </tr>

      <tr>
        <td class="endpoint">/ui/history</td>
        <td>Developer ID + Developer Secret</td>
      </tr>

    </tbody>
  </table>

</div>

</body>
</html>
`;