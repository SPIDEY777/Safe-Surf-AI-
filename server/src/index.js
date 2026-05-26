const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const scanRoutes = require('./routes/scan');
const scamRoutes = require('./routes/scam');
const emailRoutes = require('./routes/email');
const telemetryRoutes = require('./routes/telemetry');
const telemetryService = require('./services/telemetryService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000'
];

if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',').forEach(origin => {
    allowedOrigins.push(origin.trim());
  });
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isAllowed =
      allowedOrigins.includes(origin) ||
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1') ||
      origin.startsWith('chrome-extension://') ||
      origin.endsWith('.vercel.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', scanRoutes);
app.use('/api/scam', scamRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/telemetry', telemetryRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'SafeSurf AI Backend',
    status: 'running',
    version: '1.0'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'active',
    timestamp: new Date()
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 SafeSurf AI Backend running on port ${PORT}`);

  try {
    await telemetryService.seedInitialData();
    console.log('📊 Telemetry initialized');
  } catch (seedErr) {
    console.error(
      '[TELEMETRY STARTUP ERROR]',
      seedErr.message
    );
  }
});