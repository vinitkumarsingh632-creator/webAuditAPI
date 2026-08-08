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

## Example API Request

```bash
curl -X POST https://webauditapi.onrender.com/api/v1/analyze   -H "Content-Type: application/json"   -H "X-API-Key: wa_live_YOUR_API_KEY"   -d '{"url":"https://example.com"}'
```

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
