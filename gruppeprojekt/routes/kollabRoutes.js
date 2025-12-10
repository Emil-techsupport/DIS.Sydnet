const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');
const webhookController = require('../controllers/webhookController');
const { twilioRateLimiter } = require('../middlewares/rateLimiter'); // importerer rate limiterne
const { checkAuth } = require('../controllers/authController');

// POST /api/kollab/send-sms - Send SMS til vært (beskyttet - kræver login)
router.post('/send-sms', checkAuth, smsController.sendKollabSMS);

// POST /api/kollab/webhook - Twilio webhook for indkommende SMS (når vært B svarer)
// IKKE beskyttet med checkAuth - Twilio kalder denne direkte, ikke brugere
// Rate limiteren tjekker først, derefter håndteres webhook
router.post('/webhook', twilioRateLimiter, webhookController.twilioWebhook);

module.exports = router;