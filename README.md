# TK Service Daily Report

Self-hosted warehouse incident parser + daily report server.

## What changed

- Removed the hardcoded Render API URL from the browser code.
- Removed plaintext passwords from `users.js`.
- Added server-side hashed user storage in `data/users.json`.
- Added local JSON storage for daily report data in `data/daily-report-data.json`.
- Added user management commands for adding, removing, listing, and changing passwords.
- Added same-origin hosting: the Express server can serve both the webpage and API.

## Start locally

```bash
npm install
npm start
```

Open:

```text
http://localhost:3002
```

Health check:

```text
http://localhost:3002/api/health
```

## Private storage

By default, private data is stored here:

```text
./data
```

For a real server, use an external private folder:

```bash
TKS_DATA_DIR=/opt/tkservice-data npm start
```

On Windows PowerShell:

```powershell
$env:TKS_DATA_DIR="C:\\tkservice-data"
npm start
```

The storage folder contains:

```text
users.json
 daily-report-data.json
```

Do not publish this folder publicly.

## User management

List users:

```bash
npm run users:list
```

Add user:

```bash
node scripts/manage-users.js add username "Full Name" operator "StrongPassword" employee_id
```

Add leader:

```bash
node scripts/manage-users.js add leadername "Full Name" leader "StrongPassword" employee_id
```

Change password:

```bash
node scripts/manage-users.js password username "NewStrongPassword"
```

Remove user:

```bash
node scripts/manage-users.js remove username
```

## Frontend API URL

If the webpage and API are served from the same domain, keep this empty in both HTML files:

```html
<meta name="tkservice-api-base" content="" />
```

If the frontend is on one domain and API is on another, set it like this:

```html
<meta name="tkservice-api-base" content="https://api.your-domain.com" />
```

## Environment variables

Copy `.env.example` if needed:

```bash
cp .env.example .env
```

Main variables:

```text
PORT=3002
TKS_DATA_DIR=./data
CORS_ORIGIN=https://tkservice.your-domain.com
OPENAI_API_KEY=optional, only needed for AI classification
```
