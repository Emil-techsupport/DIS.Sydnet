const twilio = require('twilio');
const fs = require('fs');
const path = require('path');

//Kalder til vores env fil og får info derfra.
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

    //'Anna': '+4591977138',  // Medas nr 
    //'Tim': '+4591977138'    // Medas nr
// Værters telefonnumre 
const værtTelefonnumre = {
    'Anna': '+4528684727',  // Emils nr 
    'Tim': '+4531903444'    // Jans nr
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

function laesAktiveBeskeder() {
    
    console.log("****** Prøver at læse JSON fil *************");

    let aktiveBeskederindhold;

    try{
        aktiveBeskederindhold =  fs.readFileSync(aktiveBeskederFil, 'utf8');
 
        const lines = aktiveBeskederindhold.split('\n');
        const dictionary = {};

        lines.forEach((line)=>{
            console.log("****line*****");
            console.log(line);
            if (!line.includes("{")&&!line.includes("}")){
                // trim linjen først
                const trimmedLine = line.trim();

                // find første kolon — hvis ingen kolon, spring over
                const index = trimmedLine.indexOf(':');

                if (index === -1) return;

                // brug slice i stedet for split, så værdien kan indeholde ':'
                let key = trimmedLine.slice(0, index).trim();
                let value = trimmedLine.slice(index + 1).trim();

                // fjern omkringliggende anførselstegn (single eller double) fra key og value
                key = key.replace(/^['"]+|['"]+$/g, '');
                value = value.replace(/^['"]+|['"]+$/g, '');

                // fjern trailing komma i value, hvis der er et
                value = value
                    .replace(/^['"]+|['"]+$/g, '')   // fjern ydre anførselstegn igen (sikrer dobbeltrens)
                    .replace(/",?$/, '')             // fjerner slut: " eller ",
                    .replace(/,$/, '')               // fjerner trailing komma
                    .trim();

                dictionary[key] = value;

                /*
                const[key,value] = line.split(':');
                const trimmedKey = key.trim();
                const trimmedValue = value.trim();

                dictionary[trimmedKey] = trimmedValue;*/
            }
        });

        return dictionary;

    } catch (error) {
        console.error('Fejl i forbindelse med laesning af aktiveBeskeder.json fil.', error.message);
    }


}


// Send SMS til vært og bekræftelse til afsender
async function sendSMSTilVært(beskedData) {
  //  kollabside.html linje 269-281 bygger beskedens objekt og det er her vi bruger det til twilio
    // Find Vært B's telefonnummer (den der modtager beskeden)
    const værtBsTlf = værtTelefonnumre[beskedData.eventInfo.host];
    
    // Gem tracking - begge retninger så de kan kommunikere
    // Vært B's nummer -> Vært A's nummer (så Vært B kan finde Vært A når de svarer)
    //console.log("****besked.Data.senderPhone****");
    //console.log(beskedData.senderPhone);
    let værtAsTlf = beskedData.senderPhone

    aktiveBeskeder[værtBsTlf] = værtAsTlf;

    //console.log("****AKtivebeskeder tlf*****");
    //console.log(aktiveBeskeder);
    // Vært A's nummer -> Vært B's nummer (så Vært A kan finde Vært B når de svarer)
    //console.log("****værtTlf****");
    //console.log(værtBsTlf);

    aktiveBeskeder[værtAsTlf] = værtBsTlf;

    console.log("****Aktivebeskeder*****");
    console.log(aktiveBeskeder);
    
    // Gem til fil så det overlever server genstart
    gemAktiveBeskeder();
    
    // Opret SMS tekst der skal sendes til *********vært B**********
    const smsBesked = 
`Ny samarbejde-anmodning!

Fra: ${værtAsTlf}
Omkring dette af dine events: ${beskedData.eventInfo.title}

Besked:
${beskedData.messageText}
Svar på denne SMS for at kontakte ${beskedData.senderName}.
- Understory`.trim();

        console.log("*****Dato2025*******");
        console.log("*****Når vi hertil? Twilio.js*****");
        console.log(client.messages);
        console.log("*****Besked*****");
        console.log(smsBesked);        
        console.log("twilioPhoneNumber: " + twilioPhoneNumber);
        console.log("værtAsTlf: " + værtAsTlf);
        console.log("værtBsTlf: " + værtBsTlf);
        console.log("***** Client *******");
        console.log(client);
    


    //Her sender vi beskeden til vært B via Twilio api

    const message = await client.messages.create({
        body: smsBesked,
        from: twilioPhoneNumber,
        to: værtBsTlf
    });

    
    console.log("****Første besked fra Vært A til vært B****");
    console.log(message);


    // Send bekræftelse til afsender
    const bekræftelsesBesked = 
`Din samarbejde-anmodning er sendt!
Du har sendt en anmodning om samarbejde til ${beskedData.eventInfo.host} om følgende event:
"${beskedData.eventInfo.title}"

- Understory`;
     //Her sender vi besked til vært A
    await client.messages.create({
        body: bekræftelsesBesked,
        from: twilioPhoneNumber,
        to: værtAsTlf
    });
    
   console.log("*****Return****");
   console.log(message.sid);
   console.log(værtBsTlf);
    
    return { 
        success: true,
        messageSid: message.sid,
        værtTelefon: værtBsTlf
    };
}


// funktionen: Vært B svarer på SMS, kalder denne funktion, den videresender beskeden til vært A 
// bliver kaldt af 


async function håndterIndkommendeSMS(fraNummer, tilNummer, beskedTekst) {
    // ekstra tjek om twilio er sat op
    console.log("*****Client i håndterIndkommendeSMS******");
    console.log(client);
    if (!client) {
        return console.log("*****Fejl i henting af info fra Twilio*****");
    }

    console.log("*****håndterIndkommendeSMS indhold2*****");
    console.log(fraNummer +":"+ tilNummer + ":"+ beskedTekst);

    console.log("*****Indlæsning af aktive beskeder****");
    let aktivebeskeder_dict = laesAktiveBeskeder();
    console.log(aktivebeskeder_dict);
    console.log(aktivebeskeder_dict[fraNummer]);
    let intiatorTlfNummer = aktivebeskeder_dict[fraNummer];
    console.log(aktivebeskeder_dict[intiatorTlfNummer]);
    // fraNummer = Vært B (den der lige har sendt beskeden)
    // Find Vært A's telefonnummer (den der skal modtage beskeden)
    // husk dette er en objekt dvs:
    //Objektet viser alle aktive samtaler. Hver nøgle er et telefonnummer,
    //  og værdien er det nummer, de kan kommunikere med.
    //const værtATelefon = aktiveBeskeder[værtAsTlf];
    //let værtATelefon = "+4531903444";

    console.log("*****VærtTelefoner****");
    console.log(fraNummer);
    console.log(tilNummer);
    console.log(aktivebeskeder_dict[fraNummer]);

    
    if (aktivebeskeder_dict[fraNummer]) { // hvis Vært A's telefonnummer findes, send beskeden videre
        // Send besked videre til Vært A
        console.log("*****Vi kommer ind i if værtatlf****");

        await client.messages.create({
            body: `Svar fra vært:\n\n${beskedTekst}\n\nSvar på denne SMS for at fortsætte samtalen.\n\n- Understory`,
            from: twilioPhoneNumber,
            to: aktivebeskeder_dict[fraNummer] // send beskeden til Vært A
        });
        
        // Gem modsat retning så begge kan svare til hinanden
        //aktiveBeskeder[værtBsTlf] = fraNummer;
        
        // Gem til fil så det overlever server genstart
        //gemAktiveBeskeder();
    }
}

module.exports = {
    sendSMSTilVært, 
    håndterIndkommendeSMS
};
