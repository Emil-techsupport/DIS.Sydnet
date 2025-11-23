const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Opret Twilio klient her bliver Twilio klient oprettet med accountSid og authToken fra .env filen så det der sætter forbindelsen til Twilio det er sådan vi får adgang til twilio API 
const client = twilio(accountSid, authToken);

// Værters telefonnumre 
const værtTelefonnumre = {
    'Anna': '+4591977138',  // Medas nr 
    'Tim': '+4521663931'    // Medas nr
};

// Tracking: værtB -> værtA så man kan videresende svar
const aktiveBeskeder = {};

// Send SMS til vært og bekræftelse til afsender her bliver SMS beskeden bygget til vært B
async function sendSMSTilVært(beskedData) {
    // Find værtens telefonnummer her bliver værtens telefonnummer hentet ud fra værtTelefonnumre objektet
    const værtTlf = værtTelefonnumre[beskedData.eventInfo.host];
    
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
    
    await client.messages.create({
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
    
    return { success: true };
}

async function håndterIndkommendeSMS(fraNummer, tilNummer, beskedTekst) {
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
