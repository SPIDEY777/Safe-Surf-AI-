const scanService = require('../services/scanService');

/**
 * Controller to handle URL analysis requests
 */
const analyzeUrl = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`[SCAN] Request received for: ${url}`);

    // Call the service layer to perform analysis
    const analysisResult = await scanService.performFullAnalysis(url);

    // Report to telemetry service in real-time
    try {
      const telemetryService = require('../services/telemetryService');
      telemetryService.logScanEvent({
        type: 'URL',
        target: url,
        risk: analysisResult.risk,
        score: analysisResult.score,
        category: analysisResult.indicators && analysisResult.indicators.length > 0 ? analysisResult.indicators[0] : (analysisResult.risk === 'Safe' ? 'Web Audit' : 'Phishing'),
        reason: analysisResult.explanation
      });
    } catch (telemetryErr) {
      console.error('[TELEMETRY ERROR] Failed to log URL scan:', telemetryErr.message);
    }

    return res.status(200).json(analysisResult);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeUrl,
};
