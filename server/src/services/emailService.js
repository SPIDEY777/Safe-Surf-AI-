const { analyzeEmailHeuristics } = require('../utils/emailAnalyzer');
const { analyzeEmailPhishing } = require('./aiService');

/**
 * Email Analysis Orchestration Service
 */
const performEmailAnalysis = async (emailData) => {
    // 1. Local Heuristics
    const heuristicResult = analyzeEmailHeuristics(emailData);

    // 2. AI Intelligence
    let aiResult = null;
    try {
        aiResult = await analyzeEmailPhishing(emailData);
    } catch (err) {
        console.warn('[EMAIL SERVICE] AI Analysis failed, falling back to heuristics.');
    }

    // 3. Synthesize Final Report
    const score = aiResult?.threatScore || heuristicResult.score;
    const finalRisk = score > 75 ? 'Dangerous' : (score > 35 ? 'Suspicious' : 'Safe');

    return {
        ...emailData,
        score,
        phishingProbability: aiResult?.phishingProbability || score,
        risk: finalRisk,
        indicators: aiResult?.indicators || heuristicResult.indicators,
        impersonation: aiResult?.impersonationDetected || heuristicResult.indicators.some(i => i.includes('Impersonation')),
        urgency: aiResult?.urgencyTactics || heuristicResult.indicators.includes('Artificial Urgency in Subject'),
        harvesting: aiResult?.harvestingLanguage || heuristicResult.indicators.includes('Credential Harvesting Language'),
        explanation: aiResult?.explanation || `Analysis detected ${heuristicResult.indicators.length} critical indicators in this email structure.`,
        recommendations: aiResult?.recommendations || [
            "Do not click any links or download attachments from this sender.",
            "Report this email as phishing to your IT department or mail provider.",
            "If you entered credentials, change your password immediately.",
            "Check the sender's actual email address, not just the display name."
        ]
    };
};

module.exports = {
    performEmailAnalysis,
};
