const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const { validateWebsiteUrl } = require('../middlewares/urlValidationMiddleware');

// POST /api/scan
router.post('/scan', validateWebsiteUrl, scanController.analyzeUrl);

module.exports = router;
