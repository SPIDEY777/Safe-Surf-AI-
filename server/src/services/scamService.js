const { analyzeScamPatterns } = require('../utils/scamAnalyzer');
const { analyzeScamMessage } = require('./aiService');

/**
 * Scam Analysis Orchestration Service
 */
const performScamAnalysis = async (message) => {
    // 1. Local Heuristics
    const patternResult = analyzeScamPatterns(message);

    // 2. AI Enrichment
    let aiResult = null;
    try {
        aiResult = await analyzeScamMessage(message);
    } catch (err) {
        console.warn('[SCAM SERVICE] AI analysis failed, falling back to heuristics.');
    }

    // 3. Merge Results
    return {
        message,
        score: aiResult?.riskScore || patternResult.score,
        risk: aiResult ? (aiResult.riskScore > 70 ? 'Dangerous' : (aiResult.riskScore > 30 ? 'Suspicious' : 'Safe')) : patternResult.risk,
        urgency: aiResult?.urgencyLevel || (patternResult.indicators.includes('High Urgency Language') ? 'High' : 'Low'),
        manipulation: aiResult?.manipulationDetected || false,
        impersonation: aiResult?.impersonationDetected || false,
        phishingLanguage: aiResult?.phishingLanguage || patternResult.indicators.includes('Suspicious URL/Shortener'),
        emotionalPressure: aiResult?.emotionalPressure || false,
        explanation: aiResult?.simpleExplanation || (patternResult.indicators.length > 0 ? `We detected ${patternResult.indicators.join(' and ').toLowerCase()}. This message might be a scam.` : "No immediate scam indicators detected."),
        indicators: aiResult?.reasoning ? [aiResult.reasoning] : patternResult.indicators,
        recommendations: aiResult?.recommendations || [
            "Never share your OTP or password with anyone.",
            "Do not click on links from unknown senders.",
            "Verify the message by calling the official customer care number."
        ]
    };
};

module.exports = {
    performScamAnalysis,
};
