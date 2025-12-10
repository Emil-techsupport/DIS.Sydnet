const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');
const webhookController = require('../controllers/webhookController');
const { twilioRateLimiter } = require('../middlewares/rateLimiter'); // importerer rate limiterne


// POST /api/kollab/send-sms - Send SMS til vært
// Bliver kaldt fra "kollabside.html" og videre sendt herfra til smsController.js
router.post('/send-sms', smsController.sendKollabSMS);

// POST /api/kollab/webhook bliver kaldt af Twilio! Det er webhooken for indkommende beskeder til Twilio selv
// Rate limiteren tjekker først, derefter håndteres webhook
router.post('/webhook', twilioRateLimiter, webhookController.twilioWebhook);

module.exports = router;