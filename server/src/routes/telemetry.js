const express = require('express');
const router = express.Router();
const telemetryService = require('../services/telemetryService');

// GET /api/telemetry/dashboard
router.get('/dashboard', (req, res) => {
  try {
    const { timeframe } = req.query;
    const data = telemetryService.getDashboardData(timeframe);
    res.json(data);
  } catch (error) {
    console.error('[TELEMETRY ROUTE ERROR]', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

module.exports = router;
