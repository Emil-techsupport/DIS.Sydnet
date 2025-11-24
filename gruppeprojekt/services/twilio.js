const twilio = require('twilio');
const fs = require('fs');
const path = require('path');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Fil til at gemme aktive beskeder
const aktiveBeskederFil = path.join(__dirname, '..', 'data', 'aktiveBeskeder.json');

let client = null;
if (accountSid && authToken && twilioPhoneNumber) {
    try {
        client = twilio(accountSid, authToken);
        console.log('Twilio klient oprettet succesfuldt');
        console.log('Account SID:', accountSid.substring(0, 10) + '...'); // Vis kun første 10 tegn for sikkerhed
        console.log('Auth Token:', authToken.substring(0, 10) + '...'); // Vis kun første 10 tegn for sikkerhed
        console.log('Phone Number:', twilioPhoneNumber);
    } catch (error) {
        console.error('Fejl ved oprettelse af Twilio klient:', error.message);
    }
} else {
    console.error('Twilio credentials mangler:', {
        hasAccountSid: !!accountSid,
        hasAuthToken: !!authToken,
        hasPhoneNumber: !!twilioPhoneNumber,
        accountSidLength: accountSid ? accountSid.length : 0,
        authTokenLength: authToken ? authToken.length : 0
    });
}

// Værters telefonnumre 
const værtTelefonnumre = {
    'Anna': '+4591977138',  // Medas nr 
    'Tim': '+4591977138'    // Medas nr
};

// Tracking: værtB -> værtA så man kan videresende svar
let aktiveBeskeder = {};

// Gem aktive beskeder til fil
function gemAktiveBeskeder() {
    try {
        // Sørg for at mappen eksisterer
        const dataDir = path.dirname(aktiveBeskederFil);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
            console.log('📁 Data mappe oprettet:', dataDir);
        }
        
        fs.writeFileSync(aktiveBeskederFil, JSON.stringify(aktiveBeskeder, null, 2));
        console.log('✅ aktiveBeskeder gemt til fil:', aktiveBeskederFil);
    } catch (error) {
        console.error('❌ Fejl ved at gemme aktiveBeskeder:', error.message);
        console.error('Fejl detaljer:', error);
    }
}

// Indlæs aktive beskeder fra fil
function indlæsAktiveBeskeder() {
    try {
        console.log('🔍 Søger efter aktiveBeskeder fil:', aktiveBeskederFil);
        if (fs.existsSync(aktiveBeskederFil)) {
            const data = fs.readFileSync(aktiveBeskederFil, 'utf8');
            aktiveBeskeder = JSON.parse(data);
            console.log('✅ aktiveBeskeder indlæst fra fil:', Object.keys(aktiveBeskeder).length, 'nøgler');
            console.log('📊 Indhold:', JSON.stringify(aktiveBeskeder, null, 2));
        } else {
            console.log('⚠️ Ingen eksisterende aktiveBeskeder fil - starter med tom objekt');
            console.log('📁 Fil sti:', aktiveBeskederFil);
        }
    } catch (error) {
        console.error('❌ Fejl ved at indlæse aktiveBeskeder:', error.message);
        console.error('Fejl detaljer:', error);
        aktiveBeskeder = {};
    }
}

// Indlæs data når modulet starter
indlæsAktiveBeskeder();

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
    
    // Gem tracking FØRST - normaliser telefonnumre og gem i flere formater
    const normaliseretVærtTlf = værtTlf.replace(/\s/g, '').replace(/^00/, '+');
    const normaliseretSenderPhone = beskedData.senderPhone.replace(/\s/g, '').replace(/^00/, '+');
    const rensetVærtTlf = normaliseretVærtTlf.replace(/[^\d+]/g, '');
    
    // Gem i flere formater for at være sikker på at finde det igen
    // Gem begge retninger fra starten så de kan kommunikere hele tiden
    aktiveBeskeder[normaliseretVærtTlf] = normaliseretSenderPhone;
    aktiveBeskeder[rensetVærtTlf] = normaliseretSenderPhone;
    aktiveBeskeder[værtTlf] = normaliseretSenderPhone;
    
    // Gem også den modsatte retning så begge kan svare med det samme
    aktiveBeskeder[normaliseretSenderPhone] = normaliseretVærtTlf;
    aktiveBeskeder[normaliseretSenderPhone.replace(/[^\d+]/g, '')] = normaliseretVærtTlf;
    
    console.log('✅ Tracking gemt FØR SMS sendes:', { 
        værtTlf: normaliseretVærtTlf, 
        rensetVærtTlf: rensetVærtTlf,
        senderPhone: normaliseretSenderPhone,
        alleNøgler: Object.keys(aktiveBeskeder),
        antalNøgler: Object.keys(aktiveBeskeder).length,
        fuldAktiveBeskeder: JSON.stringify(aktiveBeskeder, null, 2)
    });
    
    // Gem til fil så det overlever server genstart
    gemAktiveBeskeder();
    
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
    console.log('håndterIndkommendeSMS kaldt med:', { fraNummer, tilNummer, beskedTekst });
    console.log('aktiveBeskeder:', aktiveBeskeder);
    console.log('Antal aktive beskeder:', Object.keys(aktiveBeskeder).length);
    
    if (Object.keys(aktiveBeskeder).length === 0) {
        console.error('⚠️ ADVARSEL: aktiveBeskeder er tom! Dette kan betyde:');
        console.error('   1. Serveren er blevet genstartet efter besked blev sendt');
        console.error('   2. Tracking blev aldrig gemt da besked blev sendt');
        console.error('   3. Beskeden blev sendt før tracking blev gemt');
    }
    
    if (!client) {
        console.error('Twilio client er ikke oprettet');
        return;
    }
    
    // Normaliser telefonnummer (fjern mellemrum og sikre + format)
    const normaliseretFraNummer = fraNummer.replace(/\s/g, '').replace(/^00/, '+');
    // Fjern også eventuelle bindestreger eller andre tegn
    const rensetFraNummer = normaliseretFraNummer.replace(/[^\d+]/g, '');
    console.log('Normaliseret fraNummer:', normaliseretFraNummer);
    console.log('Renset fraNummer:', rensetFraNummer);
    
    // Find afsender telefon - prøv alle mulige formater
    const afsenderTelefon = aktiveBeskeder[fraNummer] 
        || aktiveBeskeder[normaliseretFraNummer] 
        || aktiveBeskeder[rensetFraNummer]
        || aktiveBeskeder[fraNummer.replace(/\s/g, '')];
    console.log('afsenderTelefon fundet:', afsenderTelefon);
    
    if (afsenderTelefon) {
        console.log('Forsøger at videresende besked til:', afsenderTelefon);
        try {
            const result = await client.messages.create({
                body: `Svar fra vært:\n\n${beskedTekst}\n\nSvar på denne SMS for at fortsætte samtalen.\n\n- Understory`,
                from: twilioPhoneNumber,
                to: afsenderTelefon
            });
            console.log('Besked videresendt succesfuldt til:', afsenderTelefon);
            console.log('Twilio Message SID:', result.sid);
            console.log('Twilio Status:', result.status);
            console.log('Twilio Error Code:', result.errorCode);
            console.log('Twilio Error Message:', result.errorMessage);
            
            // Gem også den modsatte retning så begge kan svare til hinanden
            const normaliseretAfsender = afsenderTelefon.replace(/\s/g, '').replace(/^00/, '+');
            const rensetAfsender = normaliseretAfsender.replace(/[^\d+]/g, '');
            
            aktiveBeskeder[normaliseretAfsender] = normaliseretFraNummer;
            aktiveBeskeder[rensetAfsender] = normaliseretFraNummer;
            aktiveBeskeder[afsenderTelefon] = normaliseretFraNummer;
            
            // Gem til fil så det overlever server genstart
            gemAktiveBeskeder();
            
            console.log('Modsat retning gemt:', { 
                fra: normaliseretAfsender, 
                til: normaliseretFraNummer,
                aktiveBeskeder: Object.keys(aktiveBeskeder)
            });
        } catch (error) {
            console.error('Fejl ved videresendelse af besked:', error.message);
            console.error('Fejl kode:', error.code);
            console.error('Fejl status:', error.status);
            console.error('Fuld fejl:', JSON.stringify(error, null, 2));
            throw error;
        }
    } else {
        console.error('Ingen afsender telefon fundet for:', fraNummer);
        console.error('Tilgængelige nøgler i aktiveBeskeder:', Object.keys(aktiveBeskeder));
    }
}

module.exports = {
    sendSMSTilVært, 
    håndterIndkommendeSMS
};
