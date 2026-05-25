const express = require('express');
const { performScamAnalysis } = require('../services/scamService');
const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const results = await performScamAnalysis(message);

    // Report to telemetry service in real-time
    try {
      const telemetryService = require('../services/telemetryService');
      telemetryService.logScanEvent({
        type: 'Message',
        target: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        risk: results.risk,
        score: results.score,
        category: results.phishingLanguage ? 'Phishing Message' : (results.risk === 'Safe' ? 'Message Check' : 'Spam Heuristics'),
        reason: results.explanation
      });
    } catch (telemetryErr) {
      console.error('[TELEMETRY ERROR] Failed to log scam analysis:', telemetryErr.message);
    }

    res.json(results);
  } catch (error) {
    console.error('[SCAM ROUTE ERROR]', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

module.exports = router;
