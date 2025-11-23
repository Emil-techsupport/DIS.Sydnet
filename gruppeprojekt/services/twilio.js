const twilio = require('twilio');

// Twilio konfiguration fra .env fil
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Opret Twilio klient her bliver Twilio klient oprettet med accountSid og authToken fra .env filen så det der sætter forbindelsen til Twilio det er sådan vi får adgang til twilio API 
const client = twilio(accountSid, authToken);

// Værters telefonnumre 
const værtTelefonnumre = {
    'Anna': '+4591977138',  // Medas nr 
    'Tim': '+4591977138'    // Medas nr
};

// Tracking: værtB -> værtA så man kan videresende svar
const aktiveBeskeder = {};

// Send SMS til vært og bekræftelse til afsender her bliver SMS beskeden bygget til vært B
async function sendSMSTilVært(beskedData) {
    // Find værtens telefonnummer her bliver værtens telefonnummer hentet ud fra værtTelefonnumre objektet
    const værtTlf = værtTelefonnumre[beskedData.eventInfo.host];
    
    // Gem tracking her bliver tracking gemt i aktiveBeskeder objektet
    aktiveBeskeder[værtTlf] = beskedData.senderPhone;
    
    // Send SMS til værten her bliver SMS beskeden bygget til vært B
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
    
    // Send bekræftelses-SMS til afsenderen så vært A  ved at beskeden er sendt til vært B
    const bekræftelsesBesked = `Din kollab-anmodning er sendt!

Du har sendt en anmodning til ${beskedData.eventInfo.host} om:
"${beskedData.eventInfo.title}"

De kan svare på din besked ved at sende SMS til ${twilioPhoneNumber}.

- Understory`;
// nu bygger vi bekræftelsesbeskeden til afsenderen så vært A  ved at beskeden er sendt til vært B
    const bekræftelsesMessage = await client.messages.create({
        body: bekræftelsesBesked, // besked 
        from: twilioPhoneNumber, // vores twilio nummer
        to: beskedData.senderPhone // afsenderens telefonnummer
    });
    
    return { // returnerer success: true så vi ved at beskeden er sendt til vært B
        success: true,
        messageSid: message.sid,
        værtTelefon: værtTlf,
        bekræftelsesSid: bekræftelsesMessage.sid
    };
}

// Håndter indkommende SMS (når vært B svarer)
async function håndterIndkommendeSMS(fraNummer, tilNummer, beskedTekst) {
    // Tjek om dette er et svar fra en vært
    const afsenderTelefon = aktiveBeskeder[fraNummer];
    
    if (afsenderTelefon) {
        // Videresend til den oprindelige afsender
        await client.messages.create({
            body: `Svar fra vært:${beskedTekst} Svar på denne SMS for at fortsætte samtalen.\n\n- Understory`,
            from: twilioPhoneNumber, // vores twilio nummer
            to: afsenderTelefon // afsenderens telefonnummer
        });
    } // hvis afsenderTelefon er true så videresender vi beskeden til afsenderen
}
// her exporterer vi funktionerne så de kan bruges i andre filer bruger i controller filen
module.exports = {
    sendSMSTilVært, 
    håndterIndkommendeSMS
};
