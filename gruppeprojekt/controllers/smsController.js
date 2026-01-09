// Gør at vi kan bruge funktion fra Twilio.js
// "sendSMSTilVært" håndtere SMS-afsendelse via Twilio
const { sendSMSTilVært } = require('../services/twilio');

// Samel information så, der kan sendes SMS til vært B
 async function sendKollabSMS(req, res) {
    try {
        // Her pakker vi beskedens body ud som kommer fra kollabside.html(Indeholder skabelon besked)
        const beskedData = req.body; 
        
        //console.log("****BeskedData i smsController****");
        //console.log(beskedData);

        // Tjek at alle felter er udfyldt, så man kun kan sende besked hvis alle felter er udfyldt
        if (!beskedData.senderName || !beskedData.senderPhone || !beskedData.messageText) {
            return res.status(400).json({ // 400  fortælle at der er en fejl i requestet
                success: false,
                message: 'Udfyld alle felter'
            });
        }
        // Tjekker at vi ikke mangler eventInfo eller navn på host
        if (!beskedData.eventInfo || !beskedData.eventInfo.host) {
            return res.status(400).json({
                success: false,
                message: 'Manglende event-info'
            });
        }
        //console.log("*****Er vi nået hertil?****");

        // Send SMS til vært B ved hjælp af funktion fra twilio.js
        const result = await sendSMSTilVært(beskedData);

        //console.log("*****Er beskeden blivet sendt via Twilio?");
        //console.log(result);

        // Send svar tilbage til frontend så vi kan se at SMS'en er sendt
        res.json({
            success: true,
            message: 'SMS sendt',
            messageSid: result.messageSid,
            værtTelefon: result.værtTelefon
        });
    //Catch fejl og send error besked tilbage til os
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kunne ikke sende SMS',
            error: error.message
        });
    }
}
// Gør at vi kan bruge funktion i andre filer
// Bliver kaldet efter i kollabside.html og sendt hertil via kollabRoutes.js
module.exports = {
    sendKollabSMS
};
