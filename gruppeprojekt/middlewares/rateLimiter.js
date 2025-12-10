// Her bygger vi en rate limiter som kan bruges på vores webhooks i twilio 
const rateLimit = require('express-rate-limit'); // OBS. husk at lave npm install express-rate-limit i terminalen for at det virker

//console.log("***Inde i twilioratelimiter****");

//Sætter ratelimiter op, max 3 requests pr 10 sekunder fra samme ip
const twilioRateLimiter = rateLimit({
    windowMs: 10 * 1000,
    max: 3, 
    message: 'For mange requests fra denne IP'
});
module.exports = {
    twilioRateLimiter
};

// OBS hvis du vil teste om dette virker brug postman til at sende requests til localhost:3000/api/kollab/webhook.