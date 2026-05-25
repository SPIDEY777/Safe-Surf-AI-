/**
 * Local Heuristic Engine for Scam Message Detection
 */

const SCAM_PATTERNS = {
    urgency: [
        /immediately/i, /urgent/i, /expired/i, /suspended/i, /last chance/i,
        /24 hours/i, /action required/i, /verify now/i, /blocked/i, /unauthorized/i
    ],
    reward: [
        /won/i, /selected/i, /claim/i, /prize/i, /reward/i, /lottery/i,
        /congratulations/i, /gift card/i, /cash prize/i, /jackpot/i
    ],
    sensitive: [
        /otp/i, /password/i, /cvv/i, /credit card/i, /bank account/i,
        /social security/i, /ssn/i, /tax refund/i, /irs/i, /kyc/i
    ],
    phishing: [
        /bit\.ly/i, /tinyurl\.com/i, /t\.co/i, /is\.gd/i, /buff\.ly/i,
        /update-your-account/i, /secure-login/i, /verify-identity/i
    ]
};

const analyzeScamPatterns = (message) => {
    const indicators = [];
    let heuristicScore = 15; // Base score for unknown/suspicious input

    if (!message || message.length < 5) {
        return { score: 0, indicators: [], risk: 'Safe' };
    }

    // Check for Urgency
    if (SCAM_PATTERNS.urgency.some(p => p.test(message))) {
        heuristicScore += 25;
        indicators.push('High Urgency Language');
    }

    // Check for Reward/Lure
    if (SCAM_PATTERNS.reward.some(p => p.test(message))) {
        heuristicScore += 30;
        indicators.push('Suspected Reward/Prize Scam');
    }

    // Check for Sensitive Data Requests
    if (SCAM_PATTERNS.sensitive.some(p => p.test(message))) {
        heuristicScore += 35;
        indicators.push('Sensitive Information Request (OTP/Bank)');
    }

    // Check for Phishing Links (Generic shorteners or suspicious words)
    if (SCAM_PATTERNS.phishing.some(p => p.test(message))) {
        heuristicScore += 20;
        indicators.push('Suspicious URL/Shortener');
    }

    heuristicScore = Math.min(100, heuristicScore);

    let risk = 'Safe';
    if (heuristicScore > 70) risk = 'Dangerous';
    else if (heuristicScore > 30) risk = 'Suspicious';

    return {
        score: heuristicScore,
        risk,
        indicators
    };
};

module.exports = {
    analyzeScamPatterns
};
