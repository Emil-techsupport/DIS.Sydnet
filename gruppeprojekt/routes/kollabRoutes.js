const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');
const webhookController = require('../controllers/webhookController');

// POST /api/kollab/send-sms - Send SMS til vært
router.post('/send-sms', smsController.sendKollabSMS);

// POST /api/kollab/webhook - Twilio webhook for indkommende SMS (når vært B svarer)
router.post('/webhook', (req, res, next) => {
    console.log('=== WEBHOOK REQUEST MODTAGET ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
}, webhookController.twilioWebhook);

module.exports = router;