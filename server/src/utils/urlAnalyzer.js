/**
 * Advanced Phishing Detection Engine (Enhanced Local Heuristics)
 */

const TRUSTED_DOMAINS = [
    'google.com', 'google.co.in', 'github.com', 'microsoft.com', 
    'amazon.com', 'amazon.in', 'openai.com', 'chatgpt.com', 'youtube.com', 
    'wikipedia.org', 'apple.com', 'facebook.com', 'instagram.com', 
    'linkedin.com', 'twitter.com', 'netflix.com', 'spotify.com',
    'google.co', 'github.io', 'vercel.app', 'netlify.app'
];

const HIGH_RISK_TLDS = ['.xyz', '.top', '.pw', '.loan', '.zip', '.click', '.monster', '.support', '.work', '.biz', '.ru', '.cn', '.tk', '.ml', '.ga', '.cf', '.gq'];

/**
 * Detects if a string is a UUID
 */
const isUUID = (str) => {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidPattern.test(str);
};

/**
 * Detects if a string looks like a hash or random token (Base64, Hex, etc.)
 */
const isRandomToken = (str) => {
    if (str.length < 12) return false;
    // Check for high entropy: mix of numbers, letters, and length
    const hasNumbers = /\d/.test(str);
    const hasLower = /[a-z]/.test(str);
    const hasUpper = /[A-Z]/.test(str);
    const isHex = /^[0-9a-fA-F]+$/.test(str);
    
    // UUID segments or long hex strings are often tokens
    if (isHex && str.length > 16) return true;
    if ((hasNumbers && hasLower && hasUpper) && str.length > 20) return true;
    
    return false;
};

/**
 * Calculates Levenshtein Distance between two strings
 */
const getLevenshteinDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1  // deletion
                    )
                );
            }
        }
    }
    return matrix[b.length][a.length];
};

/**
 * Normalizes a string by applying common phishing character substitutions
 */
const normalizePhishingChars = (str) => {
    return str
        .toLowerCase()
        .replace(/0/g, 'o')
        .replace(/1/g, 'l')
        .replace(/3/g, 'e')
        .replace(/4/g, 'a')
        .replace(/5/g, 's')
        .replace(/7/g, 't')
        .replace(/8/g, 'b')
        .replace(/@/g, 'a')
        .replace(/rn/g, 'm'); // common lookalike
};

/**
 * Checks for brand impersonation and typo-squatting
 */
const detectImpersonation = (hostname) => {
    const parts = hostname.split('.');
    const domain = parts.length > 1 ? parts[parts.length - 2] : parts[0];
    const normalizedDomain = normalizePhishingChars(domain);
    
    // Exact brand names we protect
    const protectedBrands = ['google', 'paypal', 'amazon', 'microsoft', 'facebook', 'instagram', 'apple', 'netflix', 'spotify', 'github', 'chatgpt', 'openai'];

    for (const brand of protectedBrands) {
        // 1. Skip if it's the official brand domain
        const isOfficial = hostname.endsWith(`${brand}.com`) || 
                          hostname.endsWith(`${brand}.org`) || 
                          hostname.endsWith(`${brand}.net`) ||
                          hostname.endsWith(`${brand}.co`);
        
        if (isOfficial) continue;

        // 2. Normalize and check for exact match (e.g., paypa1 -> paypal)
        if (normalizedDomain === brand || normalizedDomain.includes(brand)) {
             return { risk: 80, brand: brand.toUpperCase(), type: 'Substitution/Lookalike' };
        }

        // 3. Levenshtein Distance check (for typo domains like gooogle)
        const distance = getLevenshteinDistance(domain, brand);
        if (distance > 0 && distance <= 2) {
            return { risk: 75, brand: brand.toUpperCase(), type: 'Typo-Squatting' };
        }
    }

    return null;
};

/**
 * Checks for gibberish/random character patterns in domain
 */
const detectGibberish = (hostname) => {
    const parts = hostname.split('.');
    const domain = parts.length > 1 ? parts[parts.length - 2] : parts[0];
    
    if (domain.length < 6) return false;

    // Consonant to Vowel ratio
    const vowels = domain.match(/[aeiou]/gi) || [];
    const consonants = domain.match(/[bcdfghjklmnpqrstvwxyz]/gi) || [];
    
    if (vowels.length === 0 && domain.length > 3) return true;
    if (consonants.length / (vowels.length || 1) > 6) return true;

    // Repeated characters
    const repeated = /(.)\1{3,}/; // 4+ repeats
    if (repeated.test(domain)) return true;

    // Numerical density
    const digits = domain.match(/\d/g) || [];
    if (digits.length > domain.length * 0.6) return true;

    return false;
};

const analyzeUrlPatterns = (url) => {
    const indicators = [];
    let riskScore = 0;

    try {
        const cleanedUrl = url.toLowerCase().trim();
        const urlObj = new URL(cleanedUrl.startsWith('http') ? cleanedUrl : `https://${cleanedUrl}`);
        const hostname = urlObj.hostname.replace(/^www\./, '');
        const protocol = urlObj.protocol;
        const path = urlObj.pathname;
        const search = urlObj.search;

        // 1. Resolve Root Domain for Intelligence
        const hostParts = hostname.split('.');
        const rootDomain = hostParts.slice(-2).join('.');
        const isWhitelisted = TRUSTED_DOMAINS.includes(rootDomain) || TRUSTED_DOMAINS.includes(hostname);

        // 2. WHIELIST OVERRIDE (High Priority)
        if (isWhitelisted) {
            return {
                score: 2,
                risk: 'Safe',
                indicators: [`Trusted Domain: ${rootDomain}`],
                ssl: protocol === 'https:',
                hostname,
                reputation: 'Trusted'
            };
        }

        // 3. PROTOCOL ANALYSIS
        if (protocol !== 'https:') {
            riskScore += 30;
            indicators.push('Unsecured Connection (HTTP)');
        }

        // 4. DOMAIN-LEVEL ANALYSIS (Highest Weight)
        
        // Brand Impersonation & Typosquatting (New Advanced Layer)
        const impersonation = detectImpersonation(hostname);
        if (impersonation) {
            riskScore += impersonation.risk;
            indicators.push(`Brand Impersonation Detected: ${impersonation.brand} (${impersonation.type})`);
        }

        // Gibberish Domain (only if not an impersonation which is already penalized)
        if (!impersonation && detectGibberish(hostname)) {
            riskScore += 40;
            indicators.push('Suspicious Domain Entropy (Generated Looking)');
        }

        // TLD Risk
        const tldMatch = HIGH_RISK_TLDS.find(tld => hostname.endsWith(tld));
        if (tldMatch) {
            riskScore += 25;
            indicators.push(`High-Risk TLD: ${tldMatch}`);
        }

        // IP Direct Access
        const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (ipPattern.test(hostname)) {
            riskScore += 70;
            indicators.push('Critical: Direct IP Access Detected');
        }

        // 5. PATH ANALYSIS (Contextual)
        const pathSegments = path.split('/').filter(s => s.length > 0);
        let suspiciousPathParts = 0;

        pathSegments.forEach(segment => {
            // Ignore UUIDs and simple Hashes in paths
            if (isUUID(segment) || isRandomToken(segment)) {
                // Legitimate application path pattern (UUID/Hash)
                return; 
            }

            // Check for phishing keywords in path
            const riskKeywords = ['login', 'verify', 'secure', 'auth', 'update', 'account', 'signin', 'wp-admin'];
            riskKeywords.forEach(keyword => {
                if (segment.includes(keyword)) {
                    suspiciousPathParts++;
                }
            });
            
            // Gibberish segments in path (only if DOMAIN is also unknown)
            if (detectGibberish(segment) && riskScore > 20) {
                suspiciousPathParts += 0.5;
            }
        });

        if (suspiciousPathParts > 0) {
            riskScore += Math.min(25, suspiciousPathParts * 10);
            indicators.push('Suspicious Path Keywords/Markers');
        }

        // 6. QUERY PARAMETERS
        if (search.includes('redirect=') || search.includes('url=')) {
            riskScore += 10;
            indicators.push('Open Redirect Pattern Detected');
        }

        // 7. FINAL CALIBRATION
        riskScore = Math.min(100, riskScore);
        
        let risk = 'Safe';
        if (riskScore > 65) risk = 'Dangerous';
        else if (riskScore > 35) risk = 'Suspicious';

        return {
            score: riskScore,
            risk,
            indicators,
            ssl: protocol === 'https:',
            hostname,
            reputation: riskScore < 30 ? 'High' : (riskScore < 60 ? 'Neutral' : 'Low')
        };
    } catch (err) {
        return {
            score: 75,
            risk: 'Dangerous',
            indicators: ['Anomalous URL Schema'],
            ssl: false,
            hostname: 'Unknown',
            reputation: 'None'
        };
    }
};

module.exports = {
    analyzeUrlPatterns,
};
