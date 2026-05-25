const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const scanRoutes = require('./routes/scan');
const scamRoutes = require('./routes/scam');
const emailRoutes = require('./routes/email');
const telemetryRoutes = require('./routes/telemetry');
const telemetryService = require('./services/telemetryService');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', scanRoutes);
app.use('/api/scam', scamRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/telemetry', telemetryRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'active', timestamp: new Date() });
});

// Error handling middleware (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, async () => {
  console.log(`🚀 SafeSurf AI Backend running on port ${PORT}`);
  
  // Seed initial real-time telemetry from engine scans on startup
  try {
    await telemetryService.seedInitialData();
  } catch (seedErr) {
    console.error('[TELEMETRY STARTUP ERROR] Failed to seed telemetry:', seedErr.message);
  }
});
