const { analyzeUrlPatterns } = require('../utils/urlAnalyzer');
const { analyzeWithAI } = require('./aiService');
const shodanService = require('./shodanService');
const dns = require('dns').promises;

/**
 * Main Scanning Service with Infrastructure Intelligence
 */
const performFullAnalysis = async (url) => {
  // 1. Run local heuristic analysis (Instant)
  const patternResult = analyzeUrlPatterns(url);
  let finalScore = patternResult.score;
  let finalIndicators = [...patternResult.indicators];

  // 2. DNS & Infrastructure Enrichment (Shodan)
  let shodanData = null;
  let infraRisk = { score: 0, indicators: [] };
  
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const hostname = urlObj.hostname.replace(/^www\./, '');
    
    // Resolve IP
    const address = await dns.lookup(hostname);
    const ip = address.address;

    // Query Shodan
    shodanData = await shodanService.getHostInfo(ip);
    if (shodanData) {
        infraRisk = shodanService.analyzeInfrastructureRisk(shodanData);
        
        // Influence final score and indicators
        finalScore += infraRisk.score;
        finalIndicators = [...finalIndicators, ...infraRisk.indicators];
    }
  } catch (err) {
    console.warn(`[SERVICE] Infrastructure enrichment skipped: ${err.message}`);
  }

  // 3. AI Enrichment
  let aiResult = null;
  try {
    aiResult = await analyzeWithAI({
        url,
        indicators: finalIndicators,
        ssl: patternResult.ssl,
        score: Math.min(100, finalScore),
        risk: finalScore > 60 ? 'Dangerous' : (finalScore > 30 ? 'Suspicious' : 'Safe')
    });
  } catch (err) {
    console.warn('[SERVICE] AI enrichment failed, using local reasoning.');
  }

  // Define Final Risk Label
  const calibratedScore = Math.min(100, finalScore);
  let finalRisk = 'Safe';
  if (calibratedScore > 60) finalRisk = 'Dangerous';
  else if (calibratedScore > 30) finalRisk = 'Suspicious';

  // 4. Fallback Heuristics for Reasoning/Recommendation
  const getHeuristicExplanation = (risk, indicators) => {
    if (risk === 'Safe') {
        return `This domain appears consistent with established web standards. Our analyzer found no suspicious patterns or brand impersonation attempts.`;
    }
    if (risk === 'Suspicious') {
        return `Caution: We found markers like "${indicators[0]?.toLowerCase()}" that are frequently used in social engineering or suspicious hosting regions.`;
    }
    return `Critical Alert: Multiple high-risk indicators detected including ${indicators.slice(0, 2).join(' and ')}. This URL strongly matches known phishing fingerprints.`;
  };

  const getHeuristicRecommendation = (risk) => {
    if (risk === 'Safe') return 'Maintain standard security hygiene. Always check the green lock icon in your browser.';
    if (risk === 'Suspicious') return 'Be wary of any requests for login credentials or payments on this specific page.';
    return 'DO NOT interact. If you entered any info, change your passwords immediately and look for unauthorized transactions.';
  };

  return {
    url,
    score: calibratedScore,
    risk: finalRisk,
    ssl: patternResult.ssl,
    reputation: calibratedScore < 30 ? 'High' : (calibratedScore < 60 ? 'Neutral' : 'Low'),
    explanation: aiResult?.explanation || getHeuristicExplanation(finalRisk, finalIndicators),
    indicators: finalIndicators,
    recommendation: aiResult?.recommendation || getHeuristicRecommendation(finalRisk),
    aiReasoning: aiResult?.reasoning || 'Local pattern-matching engine applied.',
    infrastructure: shodanData ? {
        ip: shodanData.ip,
        org: shodanData.org,
        country: shodanData.country,
        ports: shodanData.ports,
        riskScore: infraRisk.score
    } : null
  };
};

module.exports = {
  performFullAnalysis,
};
