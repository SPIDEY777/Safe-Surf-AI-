 # 🛡️ SafeSurf AI

## AI-Powered Cross-Platform Threat Intelligence Platform

SafeSurf AI is a real-time cybersecurity platform designed to protect users and organizations against phishing attacks, scam messages, impersonation campaigns, malicious URLs, suspicious emails, and social engineering threats.

The platform combines:
- Advanced heuristic analysis
- AI-powered threat reasoning
- Infrastructure intelligence
- Enterprise telemetry analytics
- Real-time phishing detection

SafeSurf AI is built as a multi-layer security ecosystem consisting of:
- Chrome Extension
- Enterprise Threat Analytics Dashboard
- Node.js Threat Intelligence Backend
- AI Threat Enrichment Engine

---

# 🚀 Features

## 🌐 Real-Time Website Threat Detection
Analyze websites instantly using:
- URL heuristics
- Typosquatting detection
- Entropy analysis
- Path analysis
- DNS verification
- Infrastructure intelligence
- AI threat reasoning

---

## 🧠 AI-Powered Threat Intelligence Engine
The custom-built SafeSurf AI Threat Intelligence Engine performs:
- Phishing detection
- Scam classification
- Risk scoring
- Infrastructure enrichment
- Threat reasoning
- Behavioral analysis

---

## 📊 Enterprise Threat Analytics Dashboard
Enterprise dashboard with real-time telemetry including:
- Attack statistics
- Scan history
- Phishing trends
- Blocked domains
- Employee risk analytics
- Top impersonated brands

---

## 📩 Scam & Phishing Detection
Analyze:
- SMS scams
- Email phishing attacks
- Social engineering messages
- Suspicious URLs

---

## 🔍 Infrastructure Intelligence
Integrated with Shodan to detect:
- Open ports
- Suspicious infrastructure
- Exposed services
- Hosting anomalies
- Infrastructure risk signals

---

## 🧾 Live Telemetry & Threat Monitoring
Tracks:
- Threat spikes
- Dangerous domains
- Phishing campaigns
- Impersonated brands
- User risk activity
- Scan telemetry

---

# 🏗️ Project Architecture

```bash
surfai2.0/
├── extension/              # Chrome Extension
│   ├── assets/
│   ├── background.js
│   ├── content.js
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── server/                 # Node.js + Express Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── dashboard/              # Enterprise Analytics Dashboard
│
└── README.md
```

---

# ⚙️ Tech Stack

## Frontend
- React
- Tailwind CSS
- Recharts
- Chrome Extension APIs

## Backend
- Node.js
- Express.js
- REST APIs

## Intelligence & Security
- Shodan API
- MiniMax AI API
- DNS Lookup
- Heuristic Threat Analysis

---

# 🧠 Detection Pipeline

```text
User Input
   ↓
Validation Layer
   ↓
Threat Intelligence Engine
   ↓
Heuristic Analysis
   ↓
DNS Resolution
   ↓
Infrastructure Intelligence
   ↓
AI Threat Reasoning
   ↓
Risk Scoring
   ↓
Enterprise Telemetry
   ↓
Dashboard Visualization
```

---

# 🔐 Threat Detection Techniques

## URL Heuristics
- Suspicious keywords
- Login path analysis
- HTTP protocol checks
- Excessive subdomains

## Typosquatting Detection
Detects impersonation attacks like:
- paypa1.com
- micr0soft-login.com
- gooogle-auth.net

Uses:
- Levenshtein Distance
- Character normalization
- Similarity scoring

---

## Entropy & Gibberish Analysis
Detects:
- Randomly generated domains
- AI-generated phishing URLs
- High-entropy domain structures

---

## DNS & Activity Verification
Validates:
- Real domains
- Active websites
- Reachable infrastructure
- DNS resolution

Rejects:
- Random strings
- Invalid domains
- Inactive websites
- Localhost/private IPs

---

# 📡 API Endpoints

## Scan Website
```http
POST /api/scan
```

Request:
```json
{
  "url": "https://example.com"
}
```

---

## Analyze Scam Message
```http
POST /api/scam/analyze
```

Request:
```json
{
  "message": "Your account has been suspended"
}
```

---

## Analyze Email
```http
POST /api/email/analyze
```

Request:
```json
{
  "sender": "support@example.com",
  "subject": "Urgent Verification",
  "body": "Click here to verify"
}
```

---

## Dashboard Telemetry
```http
GET /api/telemetry/dashboard
```

---

# 🖥️ Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/your-username/safesurf-ai.git
cd safesurf-ai
```

---

## 2. Backend Setup

```bash
cd server
npm install
```

Create `.env`

```env
PORT=5000
NODE_ENV=development
TRAE_API_KEY=your_api_key
TRAE_API_URL=https://api.minimax.io/v1/chat/completions
SHODAN_API_KEY=your_shodan_key
```

Start backend:

```bash
npm run dev
```

---

## 3. Dashboard Setup

```bash
cd dashboard
npm install
npm run dev
```

---

## 4. Chrome Extension Setup

1. Open Chrome
2. Visit:

```text
chrome://extensions
```

3. Enable Developer Mode
4. Click "Load Unpacked"
5. Select `extension/`

---

# ☁️ Deployment

## Frontend
Deploy using:
- Vercel

## Backend
Deploy using:
- Render

---

# 📱 Future Scope

- QR phishing detection
- Screenshot scam analysis
- Mobile PWA support
- WebSocket live telemetry
- Threat campaign correlation
- AI awareness assistant
- Multi-user enterprise monitoring

---

# 🎯 Problem Statement

Modern phishing attacks no longer happen only through websites.
Users are targeted through:
- SMS scams
- QR codes
- Emails
- Social media
- Fake login pages
- Impersonation campaigns

SafeSurf AI aims to provide:
> a unified AI-powered defense platform against modern cyber threats.

---

# 👨‍💻 Team

Built with ❤️ by Team SafeSurf AI

---

# 📜 License

This project is developed for educational, research, and cybersecurity innovation purposes.
