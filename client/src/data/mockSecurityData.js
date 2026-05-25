// SafeSurf AI - Enterprise Security Dashboard Mock Data

// 1. Executive Summary Statistics
export const mockSummaryStats = {
  totalScans: 124850,
  totalScansIncrease: 12.4, // percentage increase
  threatsDetected: 3842,
  threatsDetectedIncrease: 8.7,
  suspiciousDomains: 1420,
  suspiciousDomainsIncrease: 18.2,
  safeWebsites: 119588,
  safeWebsitesIncrease: 11.9,
  activeRiskLevel: "MODERATE", // LOW | MODERATE | HIGH | CRITICAL
  riskScore: 42, // scale 0-100
  impersonationAttempts: 928,
  impersonationAttemptsIncrease: 23.4
};

// 2. Threat Trend Analytics over time
// Daily phishing trends (last 15 days)
export const mockPhishingActivity = [
  { date: "May 11", scans: 7200, threats: 180, suspicious: 70 },
  { date: "May 12", scans: 8100, threats: 210, suspicious: 85 },
  { date: "May 13", scans: 7900, threats: 195, suspicious: 60 },
  { date: "May 14", scans: 8500, threats: 240, suspicious: 95 },
  { date: "May 15", scans: 9100, threats: 310, suspicious: 110 },
  { date: "May 16", scans: 6400, threats: 150, suspicious: 50 },
  { date: "May 17", scans: 5800, threats: 130, suspicious: 45 },
  { date: "May 18", scans: 8800, threats: 270, suspicious: 90 },
  { date: "May 19", scans: 9300, threats: 320, suspicious: 125 },
  { date: "May 20", scans: 9500, threats: 340, suspicious: 140 },
  { date: "May 21", scans: 9200, threats: 290, suspicious: 105 },
  { date: "May 22", scans: 8900, threats: 280, suspicious: 98 },
  { date: "May 23", scans: 6100, threats: 140, suspicious: 55 },
  { date: "May 24", scans: 5900, threats: 110, suspicious: 40 },
  { date: "May 25", scans: 9800, threats: 395, suspicious: 165 }
];

// Threat Score Distribution (histogram style)
export const mockScoreDistribution = [
  { range: "0-20 (Safe)", count: 9580 },
  { range: "21-40 (Safe)", count: 2378 },
  { range: "41-60 (Suspicious)", count: 1420 },
  { range: "61-80 (Dangerous)", count: 2102 },
  { range: "81-100 (Critical)", count: 1740 }
];

// Weekly scan volume split by category
export const mockWeeklyScanTrends = [
  { day: "Mon", URL: 4200, Message: 1800, Email: 2800 },
  { day: "Tue", URL: 4500, Message: 2100, Email: 3100 },
  { day: "Wed", URL: 4800, Message: 1900, Email: 2900 },
  { day: "Thu", URL: 5100, Message: 2300, Email: 3400 },
  { day: "Fri", URL: 4900, Message: 2000, Email: 3200 },
  { day: "Sat", URL: 2800, Message: 900, Email: 1200 },
  { day: "Sun", URL: 2500, Message: 800, Email: 1100 }
];

// 3. Brand Impersonation Statistics
export const mockImpersonationStats = [
  { name: "Google", value: 342, percentage: 36.8, color: "#3B82F6" },
  { name: "Microsoft", value: 238, percentage: 25.6, color: "#10B981" },
  { name: "PayPal", value: 164, percentage: 17.7, color: "#F59E0B" },
  { name: "Chase Bank", value: 82, percentage: 8.8, color: "#EC4899" },
  { name: "Amazon", value: 58, percentage: 6.3, color: "#8B5CF6" },
  { name: "Netflix", value: 44, percentage: 4.8, color: "#EF4444" }
];

// 4. Threat Distribution (Donut Chart)
export const mockThreatDistribution = [
  { name: "Safe Websites", value: 95.8, count: 119588, color: "#10B981" },
  { name: "Suspicious Domains", value: 1.1, count: 1420, color: "#F59E0B" },
  { name: "Dangerous / Phishing", value: 3.1, count: 3842, color: "#EF4444" }
];

// 5. Recent Scan logs
export const mockRecentScans = [
  {
    id: "TX-90184",
    url: "https://secure-login-chase-update.com/signin",
    risk: "Dangerous",
    score: 94,
    category: "Credential Harvesting",
    brand: "Chase Bank",
    reason: "Heuristics matched Chase Bank login structure, hosted on high-risk bulletproof ASN, SSL certificate issued 2 hours ago.",
    recommendation: "Block domain immediately. Revoke credentials if entered. Trigger DNS poisoning alerts.",
    timestamp: "2026-05-25T23:18:42+05:30"
  },
  {
    id: "TX-90183",
    url: "http://paypaI-verify-invoice.net/webscr?cmd=_login",
    risk: "Dangerous",
    score: 87,
    category: "Typosquatting & Phishing",
    brand: "PayPal",
    reason: "Contains typosquatting (homoglyph replacement: capital 'I' for lowercase 'l' in 'paypal'). Unencrypted connection.",
    recommendation: "Flag to registrar. Blacklist URL in proxy gateway. Alert users accessing this URL.",
    timestamp: "2026-05-25T23:16:15+05:30"
  },
  {
    id: "TX-90182",
    url: "https://outlook-verify-security-office365.org/login.php",
    risk: "Dangerous",
    score: 91,
    category: "Credential Harvesting",
    brand: "Microsoft",
    reason: "Impersonates Office 365. Contains form keywords harvesting domain email/passwords. Background DNS resolves to suspicious subnet.",
    recommendation: "Initiate Microsoft Security Response takedown. Block in browser extension active agent.",
    timestamp: "2026-05-25T23:14:02+05:30"
  },
  {
    id: "TX-90181",
    url: "https://support.google.com/accounts/answer/2445990",
    risk: "Safe",
    score: 4,
    category: "None",
    brand: "Google",
    reason: "Legitimate domain. Matches clean list heuristics. SSL certificate valid and high reputation registrar.",
    recommendation: "No action required. Safe to browse.",
    timestamp: "2026-05-25T23:11:55+05:30"
  },
  {
    id: "TX-90180",
    url: "https://g00g1e-security-settings.xyz/recovery/verify",
    risk: "Dangerous",
    score: 96,
    category: "Social Engineering",
    brand: "Google",
    reason: "Contains numeric-based brand character spoofing ('g00g1e'). Hosted on free TLD (.xyz). Critical suspicious login forms present.",
    recommendation: "Blacklist domain. Warn corporate accounts regarding active Google credential harvesting campaign.",
    timestamp: "2026-05-25T23:09:12+05:30"
  },
  {
    id: "TX-90179",
    url: "https://amazon-delivery-tracking-portal-status.info/orders",
    risk: "Suspicious",
    score: 55,
    category: "Typosquatting",
    brand: "Amazon",
    reason: "Domain registered recently (2 days ago). Keywords contain shipping alert templates often used in SMS phishing (smishing).",
    recommendation: "Monitor activities. Advise corporate devices to avoid inputs on this page.",
    timestamp: "2026-05-25T23:05:48+05:30"
  },
  {
    id: "TX-90178",
    url: "https://chase-checking-alert.com/alert/confirm",
    risk: "Dangerous",
    score: 82,
    category: "Credential Harvesting",
    brand: "Chase Bank",
    reason: "Keywords match Chase bank templates. SSL certificate created via free Let's Encrypt bypass. Multi-factor phishing form detected.",
    recommendation: "Initiate banking sector warning sequence. Deploy signature updates to SafeSurf AI endpoint agents.",
    timestamp: "2026-05-25T23:02:11+05:30"
  },
  {
    id: "TX-90177",
    url: "https://netflix-subscription-renew.net/login",
    risk: "Suspicious",
    score: 48,
    category: "Social Engineering",
    brand: "Netflix",
    reason: "Impersonates Netflix login. Domain is young but currently hosted in neutral region. Score elevated due to password-field layout.",
    recommendation: "Audit network traffic for outgoing credentials to this site.",
    timestamp: "2026-05-25T22:58:34+05:30"
  },
  {
    id: "TX-90176",
    url: "https://github.com/login",
    risk: "Safe",
    score: 1,
    category: "None",
    brand: "GitHub",
    reason: "Highly reputable domain. Safe certificate history and matches top 100 global whitelist perfectly.",
    recommendation: "No security action required.",
    timestamp: "2026-05-25T22:55:00+05:30"
  },
  {
    id: "TX-90175",
    url: "https://chasebank-card-activation.security-portal-update.org",
    risk: "Dangerous",
    score: 89,
    category: "Phishing Domain",
    brand: "Chase Bank",
    reason: "Brand name nested inside third-level subdomain. Registrar shows patterns matching known cybercrime network hosting profiles.",
    recommendation: "Block domain immediately and alert global SOC.",
    timestamp: "2026-05-25T22:51:22+05:30"
  }
];

// 6. Watchlist: Top Suspicious Domains
export const mockWatchlistDomains = [
  { domain: "microsoft-login-verify-office.com", score: 95, category: "Credential Harvesting", recommendation: "Trigger registrar takedown" },
  { domain: "paypal-billing-issue-resolved.net", score: 92, category: "Social Engineering", recommendation: "Flag in DNS Gateway" },
  { domain: "chase-alert-security-update.xyz", score: 90, category: "Credential Harvesting", recommendation: "Block active network route" },
  { domain: "support-google-accounts-verification.info", score: 88, category: "Phishing Domain", recommendation: "Takedown via registrar API" },
  { domain: "netflix-update-billing-card.cc", score: 84, category: "Typosquatting", recommendation: "Monitor endpoint requests" },
  { domain: "amazon-prime-giftcard-redeem.org", score: 78, category: "Social Engineering", recommendation: "Filter corporate email incoming" }
];

// 7. Security Event templates for the dynamic simulated live feed
export const liveFeedEvents = [
  {
    message: "Typosquatting domain 'paypal-verification-alert.com' flagged by DNS heuristics.",
    risk: "Dangerous",
    category: "Typosquatting",
    brand: "PayPal"
  },
  {
    message: "Phishing campaign targeting Microsoft Office 365 credentials blocked on corporate firewall.",
    risk: "Dangerous",
    category: "Credential Harvesting",
    brand: "Microsoft"
  },
  {
    message: "Suspicious authentication keyword 'verify-login' detected on new .xyz registrar domain.",
    risk: "Suspicious",
    category: "Heuristics",
    brand: "Unknown"
  },
  {
    message: "Credential harvesting endpoint detected on server hosted in high-risk ASN (AS133742).",
    risk: "Dangerous",
    category: "Infrastructure Risk",
    brand: "Unknown"
  },
  {
    message: "Zero-day phishing email pattern matched by neural network heuristics.",
    risk: "Suspicious",
    category: "AI Detection",
    brand: "Microsoft"
  },
  {
    message: "Spoofing attempt of Chase Bank login page intercepted on client desktop agent.",
    risk: "Dangerous",
    category: "Phishing Intercept",
    brand: "Chase Bank"
  },
  {
    message: "Legitimate scan request completed for 'github.com' (Threat Score: 1).",
    risk: "Safe",
    category: "Standard Scan",
    brand: "GitHub"
  },
  {
    message: "Suspected typosquatting domain 'g00gle-accounts-login.info' registered with dynamic DNS.",
    risk: "Dangerous",
    category: "Typosquatting",
    brand: "Google"
  },
  {
    message: "High-risk SSL Certificate renewal detected for domain with brand name 'netflix' in subdomain.",
    risk: "Suspicious",
    category: "SSL Impersonation",
    brand: "Netflix"
  },
  {
    message: "Phishing page hosted on IP (198.51.100.12) flagged on Shodan for open database ports.",
    risk: "Suspicious",
    category: "Shodan Enrichment",
    brand: "Unknown"
  },
  {
    message: "Suspicious SMS link 'amazon-package-alert-ref4.info' blocked by text scan heuristic.",
    risk: "Dangerous",
    category: "Typosquatting",
    brand: "Amazon"
  },
  {
    message: "Security scan cleared for 'login.salesforce.com' (Threat Score: 0).",
    risk: "Safe",
    category: "Standard Scan",
    brand: "Salesforce"
  }
];

// 8. Dynamic security insights list
export const mockSecurityInsights = [
  {
    id: 1,
    title: "Google Impersonation Surge",
    description: "Google accounts credential harvesting attacks rose by 14% over the last 48 hours, heavily leveraging newly registered .xyz and .info domains.",
    severity: "HIGH"
  },
  {
    id: 2,
    title: "Typosquatting Trends",
    description: "Typosquatting attempts targeting corporate Single Sign-On (SSO) portals increased by 23% this week, utilizing homoglyph character substitutions.",
    severity: "MEDIUM"
  },
  {
    id: 3,
    title: "Unencrypted Connection Alerts",
    description: "Over 78% of active phishing domains flagged this week lacked HTTPS or used self-signed, invalid certificates, simplifying firewall detections.",
    severity: "LOW"
  },
  {
    id: 4,
    title: "ASN Geo-Risk Hotspot",
    description: "An spike of malicious activity originating from AS-groupings in specific east-european and central-asian IP subnets has led to a reputation downgrade for these ranges.",
    severity: "MEDIUM"
  }
];
