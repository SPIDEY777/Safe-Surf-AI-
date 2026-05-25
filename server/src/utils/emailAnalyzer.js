/**
 * Local Heuristic Engine for Email Phishing Detection
 */

const SUSPICIOUS_DOMAINS = ['.xyz', '.top', '.pw', '.click', '.monster', '.account-verify.com', '.secure-login.net'];
const URGENT_SUBJECTS = [/suspend/i, /urgent/i, /action required/i, /security alert/i, /unauthorized/i, /overdue/i, /blocked/i];

const analyzeEmailHeuristics = (emailData) => {
    const { sender, subject, body } = emailData;
    const indicators = [];
    let score = 10;

    if (!sender || !subject || !body) return { score: 0, indicators: [], risk: 'Safe' };

    // 1. Sender Domain Check
    const domain = sender.split('@')[1]?.toLowerCase();
    if (domain) {
        if (SUSPICIOUS_DOMAINS.some(d => domain.endsWith(d))) {
            score += 30;
            indicators.push('High-Risk Sender Domain');
        }
        
        // Common brand impersonation patterns in domain
        if (domain.includes('google') && !domain.endsWith('google.com')) {
            score += 40;
            indicators.push('Potential Alphabet/Google Impersonation');
        }
        if (domain.includes('microsoft') && !domain.endsWith('microsoft.com')) {
            score += 40;
            indicators.push('Potential Microsoft Impersonation');
        }
    } else {
        score += 20;
        indicators.push('Invalid Sender Format');
    }

    // 2. Subject Line Analysis
    if (URGENT_SUBJECTS.some(p => p.test(subject))) {
        score += 25;
        indicators.push('Artificial Urgency in Subject');
    }

    // 3. Body Content Patterns
    if (/password/i.test(body) && /verify/i.test(body)) {
        score += 20;
        indicators.push('Credential Harvesting Language');
    }
    
    if (/bit\.ly|tinyurl\.com|t\.co/i.test(body)) {
        score += 15;
        indicators.push('Shortened URLs Detected (Obfuscation)');
    }

    score = Math.min(100, score);
    let risk = 'Safe';
    if (score > 75) risk = 'Dangerous';
    else if (score > 35) risk = 'Suspicious';

    return {
        score,
        risk,
        indicators
    };
};

module.exports = {
    analyzeEmailHeuristics
};
