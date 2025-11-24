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
        
    } catch (error) {
        console.error('Fejl ved oprettelse af Twilio klient:', error.message);
    }
}

// Værters telefonnumre 
const værtTelefonnumre = {
    'Anna': '+4591977138',  // Medas nr 
    'Tim': '+4591977138'    // Medas nr
};

// Tracking: værtB -> værtA så man kan videresende svar
let aktiveBeskeder = {};

// Gem tracking til fil, hvor vi tilføjer nye beskeder og gemmer dem 
function gemAktiveBeskeder() {
    // Opret data mappen hvis den ikke findes
    const dataPakke = path.dirname(aktiveBeskederFil);
    if (!fs.existsSync(dataPakke)) { // existsSync søger efter filen, hvis den ikke findes, opret den
        fs.mkdirSync(dataPakke, { recursive: true }); // mkdirSync opretter mappen
    }
    
    // Gem tracking data til fil
    // writeFileSync skriver data til filen, JSON.stringify konverterer objektet til en JSON streng, null, 2 indrykker dataene
    fs.writeFileSync(aktiveBeskederFil, JSON.stringify(aktiveBeskeder, null, 2));
}

 //Indlæs aktive beskeder fra fil ***************CHAT HJÆLPER FUNKTION ***************
function indlæsAktiveBeskeder() {
    try {
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
        aktiveBeskeder = {};
    }
}


// Indlæs data når modulet starter
indlæsAktiveBeskeder();
//***************************************************************************************** */

// Send SMS til vært og bekræftelse til afsender
async function sendSMSTilVært(beskedData) {
  //  kollabside.html linje 269-281 bygger beskedens objekt og det er her vi bruger det til twilio
    // Find Vært B's telefonnummer (den der modtager beskeden)
    const værtTlf = værtTelefonnumre[beskedData.eventInfo.host];
    
    // Gem tracking - begge retninger så de kan kommunikere
    // Vært B's nummer -> Vært A's nummer (så Vært B kan finde Vært A når de svarer)
    aktiveBeskeder[værtTlf] = beskedData.senderPhone;
    // Vært A's nummer -> Vært B's nummer (så Vært A kan finde Vært B når de svarer)
    aktiveBeskeder[beskedData.senderPhone] = værtTlf;
    
    // Gem til fil så det overlever server genstart
    gemAktiveBeskeder();
    
    // Send SMS til Vært B ******************** 
    const smsBesked = `Ny kollab-anmodning!

Fra: ${beskedData.senderName}
Event: ${beskedData.eventInfo.title}

Besked:
${beskedData.messageText}
Svar på denne SMS for at kontakte ${beskedData.senderName}.
- Understory`.trim();
    
    // Send SMS til vært ************* Vært B *************
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


// funktionen: Vært B svarer på SMS, kalder denne funktion, den videresender beskeden til vært A 
async function håndterIndkommendeSMS(fraNummer, tilNummer, beskedTekst) {
    // ekstra tjek om twilio er sat op
    if (!client) {
        return;
    }
    // fraNummer = Vært B (den der lige har sendt beskeden)
    // Find Vært A's telefonnummer (den der skal modtage beskeden)
    // husk dette er en objekt dvs:
    //Objektet viser alle aktive samtaler. Hver nøgle er et telefonnummer,
    //  og værdien er det nummer, de kan kommunikere med.
    const værtATelefon = aktiveBeskeder[fraNummer];

    if (værtATelefon) { // hvis Vært A's telefonnummer findes, send beskeden videre
        // Send besked videre til Vært A
        await client.messages.create({
            body: `Svar fra vært:\n\n${beskedTekst}\n\nSvar på denne SMS for at fortsætte samtalen.\n\n- Understory`,
            from: twilioPhoneNumber,
            to: værtATelefon // send beskeden til Vært A
        });
        
        // Gem modsat retning så begge kan svare til hinanden
        aktiveBeskeder[værtATelefon] = fraNummer;
        
        // Gem til fil så det overlever server genstart
        gemAktiveBeskeder();
    }
}

module.exports = {
    sendSMSTilVært, 
    håndterIndkommendeSMS
};
