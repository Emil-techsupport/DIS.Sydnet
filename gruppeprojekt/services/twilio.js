const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;
if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
}

// Værters telefonnumre 
const værtTelefonnumre = {
    'Anna': '+4591977138',  // Medas nr 
    'Tim': '+4521663931'    // Medas nr
};

// Tracking: værtB -> værtA så man kan videresende svar
const aktiveBeskeder = {};

// Send SMS til vært og bekræftelse til afsender her bliver SMS beskeden bygget til vært B
async function sendSMSTilVært(beskedData) {
    if (!client || !accountSid || !authToken || !twilioPhoneNumber) {
        throw new Error('Twilio credentials mangler i .env fil');
    }
    
    const værtTlf = værtTelefonnumre[beskedData.eventInfo.host];
    
    if (!værtTlf) {
        throw new Error(`Vært '${beskedData.eventInfo.host}' ikke fundet`);
    }
    
    // Gem tracking
    aktiveBeskeder[værtTlf] = beskedData.senderPhone;
    
    // Send SMS til vært
    const smsBesked = `Ny kollab-anmodning!

Fra: ${beskedData.senderName}
Tlf: ${beskedData.senderPhone}
Event: ${beskedData.eventInfo.title}

Besked:
${beskedData.messageText}

Svar på denne SMS for at kontakte ${beskedData.senderName}.

- Understory`.trim();
    
    const message = await client.messages.create({
        body: smsBesked,
        from: twilioPhoneNumber,
        to: værtTlf
    });
    
    // Send bekræftelse til afsender
    const bekræftelsesBesked = `Din kollab-anmodning er sendt!

Du har sendt en anmodning til ${beskedData.eventInfo.host} om:
"${beskedData.eventInfo.title}"

- Understory`;
    
    await client.messages.create({
        body: bekræftelsesBesked,
        from: twilioPhoneNumber,
        to: beskedData.senderPhone
    });
    
    return { 
        success: true,
        messageSid: message.sid,
        værtTelefon: værtTlf
    };
}

async function håndterIndkommendeSMS(fraNummer, tilNummer, beskedTekst) {
    if (!client) {
        return;
    }
    
    // Find afsender telefon
    const afsenderTelefon = aktiveBeskeder[fraNummer];
    
    if (afsenderTelefon) {
        // Videresend til afsender
        await client.messages.create({
            body: `Svar fra vært:\n\n${beskedTekst}\n\nSvar på denne SMS for at fortsætte samtalen.\n\n- Understory`,
            from: twilioPhoneNumber,
            to: afsenderTelefon
        });
    }
}

module.exports = {
    sendSMSTilVært, 
    håndterIndkommendeSMS
};
