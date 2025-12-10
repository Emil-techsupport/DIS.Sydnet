const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');
const webhookController = require('../controllers/webhookController');
const { twilioRateLimiter } = require('../middlewares/rateLimiter'); // importerer rate limiterne
const { checkAuth } = require('../controllers/authController');

// POST /api/kollab/send-sms - Send SMS til vært
router.post('/send-sms', checkAuth, smsController.sendKollabSMS);

// POST /api/kollab/webhook - Twilio webhook for indkommende SMS (når vært B svarer)
// VIGTIGT: Webhooks fra Twilio kan IKKE bruge checkAuth (de har ingen JWT cookies)
// Twilio sender webhooks fra deres servere, ikke fra browseren
// Rate limiteren beskytter mod for mange requests
router.post('/webhook', twilioRateLimiter, webhookController.twilioWebhook);

module.exports = router;