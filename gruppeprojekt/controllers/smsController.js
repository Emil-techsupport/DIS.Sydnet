// Controller til at håndtere SMS-afsendelse via Twilio

const { sendSMSTilVært } = require('../services/twilio');

// Send SMS til vært B - server side håndterer Twilio (twilio.js)
 async function sendKollabSMS(req, res) {
    try {
        const beskedData = req.body; // beskedData er skabelon for at sende beskeden til vært B kommer fra frontend (kollabside.html)
        
        // Tjek at alle felter er udfyldt så man kun kan sende besked hvis alle felter er udfyldt
        if (!beskedData.senderName || !beskedData.senderPhone || !beskedData.messageText) {
            return res.status(400).json({ // 400  fortælle at der er en fejl i requestet
                success: false,
                message: 'Udfyld alle felter'
            });
        }
        
        if (!beskedData.eventInfo || !beskedData.eventInfo.host) {
            return res.status(400).json({
                success: false,
                message: 'Manglende event-info'
            });
        }
        
        // Send SMS til vært B via twilio.js
        const result = await sendSMSTilVært(beskedData);
        
        // Send svar tilbage til frontend så vi kan se at SMS'en er sendt
        res.json({
            success: true,
            message: 'SMS sendt',
            messageSid: result.messageSid,
            værtTelefon: result.værtTelefon
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kunne ikke sende SMS',
            error: error.message
        });
    }
}

module.exports = {
    sendKollabSMS
};
