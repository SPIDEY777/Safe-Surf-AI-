const express = require('express');
const { performEmailAnalysis } = require('../services/emailService');
const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { sender, subject, body } = req.body;
    
    if (!sender || !subject || !body) {
      return res.status(400).json({ error: 'Sender, Subject, and Body are all required for analysis.' });
    }

    const results = await performEmailAnalysis({ sender, subject, body });

    // Report to telemetry service in real-time
    try {
      const telemetryService = require('../services/telemetryService');
      telemetryService.logScanEvent({
        type: 'Email',
        target: subject,
        risk: results.risk,
        score: results.score,
        category: results.impersonation ? 'Brand Spoofing' : (results.risk === 'Safe' ? 'Email Security' : 'Phishing Attempt'),
        reason: results.explanation
      });
    } catch (telemetryErr) {
      console.error('[TELEMETRY ERROR] Failed to log email analysis:', telemetryErr.message);
    }

    res.json(results);
  } catch (error) {
    console.error('[EMAIL ROUTE ERROR]', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

module.exports = router;
