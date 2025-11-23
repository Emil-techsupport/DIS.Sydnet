const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;
if (accountSid && authToken && twilioPhoneNumber) {
    try {
        client = twilio(accountSid, authToken);
        console.log('Twilio klient oprettet succesfuldt');
    } catch (error) {
        console.error('Fejl ved oprettelse af Twilio klient:', error.message);
    }
} else {
    console.error('Twilio credentials mangler:', {
        hasAccountSid: !!accountSid,
        hasAuthToken: !!authToken,
        hasPhoneNumber: !!twilioPhoneNumber
    });
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
    console.log('sendSMSTilVært kaldt med:', {
        host: beskedData.eventInfo?.host,
        senderName: beskedData.senderName,
        senderPhone: beskedData.senderPhone
    });
    
    if (!client || !accountSid || !authToken || !twilioPhoneNumber) {
        console.error('Twilio check fejlede:', {
            hasClient: !!client,
            hasAccountSid: !!accountSid,
            hasAuthToken: !!authToken,
            hasPhoneNumber: !!twilioPhoneNumber
        });
        throw new Error('Twilio credentials mangler i .env fil');
    }
    
    const værtTlf = værtTelefonnumre[beskedData.eventInfo.host];
    console.log('Vært telefonnummer fundet:', værtTlf);
    
    if (!værtTlf) {
        console.error('Vært ikke fundet i værtTelefonnumre:', beskedData.eventInfo.host);
        throw new Error(`Vært '${beskedData.eventInfo.host}' ikke fundet`);
    }
    
    // Gem tracking
    aktiveBeskeder[værtTlf] = beskedData.senderPhone;
    console.log('Tracking gemt:', { værtTlf, senderPhone: beskedData.senderPhone });
    
    // Send SMS til vært
    const smsBesked = `Ny kollab-anmodning!

Fra: ${beskedData.senderName}
Tlf: ${beskedData.senderPhone}
Event: ${beskedData.eventInfo.title}

Besked:
${beskedData.messageText}

Svar på denne SMS for at kontakte ${beskedData.senderName}.

- Understory`.trim();
    
    console.log('Forsøger at sende SMS til vært:', { from: twilioPhoneNumber, to: værtTlf });
    let message;
    try {
        message = await client.messages.create({
            body: smsBesked,
            from: twilioPhoneNumber,
            to: værtTlf
        });
        console.log('SMS sendt til vært succesfuldt:', message.sid);
    } catch (error) {
        console.error('Twilio fejl ved afsendelse til vært:', error.message);
        console.error('Twilio fejl detaljer:', error);
        throw new Error(`Twilio fejl ved afsendelse til vært: ${error.message}`);
    }
    
    // Send bekræftelse til afsender
    const bekræftelsesBesked = `Din kollab-anmodning er sendt!

Du har sendt en anmodning til ${beskedData.eventInfo.host} om:
"${beskedData.eventInfo.title}"

- Understory`;
    
    console.log('Forsøger at sende bekræftelse til afsender:', { from: twilioPhoneNumber, to: beskedData.senderPhone });
    try {
        await client.messages.create({
            body: bekræftelsesBesked,
            from: twilioPhoneNumber,
            to: beskedData.senderPhone
        });
        console.log('Bekræftelse sendt til afsender succesfuldt');
    } catch (error) {
        console.error('Twilio fejl ved bekræftelse til afsender:', error.message);
        console.error('Twilio fejl detaljer:', error);
        throw new Error(`Twilio fejl ved bekræftelse til afsender: ${error.message}`);
    }
    
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
