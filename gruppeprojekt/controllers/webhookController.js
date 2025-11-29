// Webhook controller til at håndtere indkommende SMS fra Twilio
// Dette er vigtgit når twilio sender en besked til vært B så vi kan videresende svar til vært A 
const { håndterIndkommendeSMS } = require('../services/twilio');

// Håndter Twilio webhook for indkommende SMS her bliver data hentet ud fra req.body og sendt til håndterIndkommendeSMS funktionen
async function twilioWebhook(req, res) {
    try {
        // Hent data fra Twilio
        const { From, To, Body } = req.body;
        
        // Håndter den indkommende SMS
        await håndterIndkommendeSMS(From, To, Body);
    } catch (error) {
        console.error('Fejl i twilioWebhook:', error);
    }
    // Send svar tilbage til Twilio (altid - uanset om der var fejl eller ej)
    // OBS: Vi sender XML fordi det er det Twilio forstår
    // Hvis Twilio ikke får et svar, vil den prøve at sende webhook'en igen (retry)
    res.set('Content-Type', 'text/xml'); 
    res.send(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`); 
};
// her exporterer vi funktionen så den kan bruges i andre filer bruger i app.js filen
module.exports = {
    twilioWebhook
};
