# WebAudit

WebAudit is a website auditing platform that analyzes websites for performance, SEO, accessibility, and best practices using Lighthouse.

## Features

- Website performance analysis
- Performance, SEO, Accessibility, and Best Practices scores
- LCP, FCP, CLS, Speed Index, and latency metrics
- Developer API
- Developer accounts
- API-key authentication
- Encrypted API-key storage
- Rate limiting
- MongoDB audit history
- Separate UI and API audit history
- Health, information, and limits endpoints
- API documentation endpoint

## Tech Stack

### Frontend
- Next.js
- React
- Lucide React
- ECharts

### Backend
- Node.js
- Express.js
- Lighthouse
- MongoDB
- Mongoose
- express-rate-limit
- CORS
- dotenv
- Node.js crypto

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/health` | API health |
| GET | `/api/v1/info` | API information |
| GET | `/api/v1/limits` | Rate limits |
| POST | `/api/v1/developers` | Create developer |
| POST | `/api/v1/keys` | Generate/update API key |
| GET | `/api/v1/keys` | Retrieve API key |
| POST | `/api/v1/analyze` | Analyze a website |
| GET | `/api/v1/history` | API audit history |
| POST | `/ui/analyze` | UI website analysis |
| GET | `/ui/history` | UI audit history |
| GET | `/docs` | API documentation |

## Authentication

Developer authentication uses a developer ID and developer secret.

Developer secrets are hashed before storage.

API keys are hashed for authentication and encrypted for secure retrieval using AES-256-GCM.

## Environment Variables

Create a `.env` file in the backend:

```env
PORT=5000
DB_URI=your_mongodb_connection_string
API_KEY_ENCRYPTION_SECRET=your_secret
PAGESPEED_API_KEY=pagespeed_api_key
```

Never commit secrets to Git or expose them in frontend code.

## Rate Limiting

General requests:

```text
5 requests / 15 seconds
```

Developer API requests:

```text
30 requests / 60 seconds
```

## Audit History

Audit history is stored in MongoDB and includes the URL, timestamp, status code, Lighthouse scores, Core Web Vitals, latency, and complete audit result.

UI audits use `ownerType: "ui"`.

API audits use `ownerType: "api"`.

## API-Key Storage

API-key records contain:

```text
developerId
keyHash
encryptedKey
encryptionIv
encryptionAuthTag
createdAt
lastUsedAt
requestCount
active
```

A developer should have one active API-key record. Generating a new key updates the existing record.

## Running Locally

### Backend

```bash
cd backend
npm install
npm start
```

Configure the required environment variables first.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Request Examples

Base URL:

```text
https://webauditapi.onrender.com
```

### 1. Health Check

The health endpoint does not require authentication.

```bash
curl -X GET "https://webauditapi.onrender.com/api/v1/health"
```

Windows CMD:

```cmd
curl -X GET "https://webauditapi.onrender.com/api/v1/health"
```

### 2. API Information

```bash
curl -X GET "https://webauditapi.onrender.com/api/v1/info"
```

### 3. Rate Limits

```bash
curl -X GET "https://webauditapi.onrender.com/api/v1/limits"
```

### 4. Create a Developer Account

No API key is required to create a developer account.

Request method:

```http
POST /api/v1/developers
Content-Type: application/json
```

Request body:

```json
{
  "name": "Your Name"
}
```

cURL:

```bash
curl -X POST "https://webauditapi.onrender.com/api/v1/developers" \
  -H "Content-Type: application/json" \
  -d '{"name":"Your Name"}'
```

The response provides the developer ID and developer secret. Store the developer secret securely.

### 5. Generate or Replace an API Key

This endpoint uses developer authentication.

Required headers:

```http
X-Developer-ID: YOUR_DEVELOPER_ID
X-Developer-Secret: YOUR_DEVELOPER_SECRET
```

Request:

```bash
curl -X POST "https://webauditapi.onrender.com/api/v1/keys" \
  -H "X-Developer-ID: YOUR_DEVELOPER_ID" \
  -H "X-Developer-Secret: YOUR_DEVELOPER_SECRET"
```

Generating a new key updates the existing API-key record for that developer rather than creating another active key.

### 6. Analyze a Website

The analyze endpoint requires an API key.

Required headers:

```http
Content-Type: application/json
X-API-Key: YOUR_API_KEY
```

Required JSON body:

```json
{
  "url": "https://example.com"
}
```

Linux/macOS:

```bash
curl -X POST "https://webauditapi.onrender.com/api/v1/analyze" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: wa_live_YOUR_API_KEY" \
  -d '{"url":"https://example.com"}'
```

Windows CMD:

```cmd
curl -X POST "https://webauditapi.onrender.com/api/v1/analyze" -H "Content-Type: application/json" -H "X-API-Key: wa_live_YOUR_API_KEY" -d "{"url":"https://example.com"}"
```

PowerShell:

```powershell
Invoke-RestMethod `
  -Uri "https://webauditapi.onrender.com/api/v1/analyze" `
  -Method POST `
  -Headers @{ "X-API-Key" = "wa_live_YOUR_API_KEY" } `
  -ContentType "application/json" `
  -Body (@{ url = "https://example.com" } | ConvertTo-Json)
```

The URL must be a valid `http://` or `https://` URL.

### 7. Retrieve API Audit History

```bash
curl -X GET "https://webauditapi.onrender.com/api/v1/history" \
  -H "X-API-Key: wa_live_YOUR_API_KEY"
```

### 8. UI Audit Endpoint

The dashboard uses the UI endpoint with developer authentication.

Required headers:

```http
Content-Type: application/json
X-Developer-ID: YOUR_DEVELOPER_ID
X-Developer-Secret: YOUR_DEVELOPER_SECRET
```

Request body:

```json
{
  "url": "https://example.com"
}
```

Example:

```bash
curl -X POST "https://webauditapi.onrender.com/ui/analyze" \
  -H "Content-Type: application/json" \
  -H "X-Developer-ID: YOUR_DEVELOPER_ID" \
  -H "X-Developer-Secret: YOUR_DEVELOPER_SECRET" \
  -d '{"url":"https://example.com"}'
```

### Request Summary

| Endpoint | Method | Authentication | Body |
|---|---|---|---|
| `/api/v1/health` | GET | None | None |
| `/api/v1/info` | GET | None | None |
| `/api/v1/limits` | GET | None | None |
| `/api/v1/developers` | POST | None | `{"name":"Your Name"}` |
| `/api/v1/keys` | POST | Developer ID + Developer Secret | None |
| `/api/v1/analyze` | POST | API Key | `{"url":"https://example.com"}` |
| `/api/v1/history` | GET | API Key | None |
| `/ui/analyze` | POST | Developer ID + Developer Secret | `{"url":"https://example.com"}` |

## Security

- Never commit API keys or developer secrets.
- Keep `API_KEY_ENCRYPTION_SECRET` on the backend.
- Use HTTPS in production.
- Keep rate limiting enabled.
- Never expose database credentials.

## Deployment

The project uses a Next.js frontend and an Express backend. Production environment variables must be configured on the hosting provider.

## License

Add your chosen license before publishing the repository.
