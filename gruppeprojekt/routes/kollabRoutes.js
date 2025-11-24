const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');
const webhookController = require('../controllers/webhookController');
const { twilioRateLimiter } = require('../middlewares/rateLimiter'); // importerer rate limiterne
// POST /api/kollab/send-sms - Send SMS til vært
router.post('/send-sms', smsController.sendKollabSMS);

// POST /api/kollab/webhook - Twilio webhook for indkommende SMS (når vært B svarer)
// Rate limiteren tjekker først, derefter håndteres webhook
router.post('/webhook', twilioRateLimiter, webhookController.twilioWebhook);

module.exports = router;