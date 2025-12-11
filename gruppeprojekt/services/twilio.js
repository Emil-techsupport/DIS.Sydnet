const twilio = require('twilio');
const fs = require('fs');
const path = require('path');

//Kalder til vores env fil og får info derfra.
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Fil til at gemme numre fra værter
const telefonNumreFil = path.join(__dirname, '..', 'data', 'telefonNumre.json');

//Opretter client variable
let client = null;
//Hvis vi har alt info som twilio api kræver, så gem det i client
if (accountSid && authToken && twilioPhoneNumber) {
    try {
        client = twilio(accountSid, authToken);
        
    } catch (error) {
        console.error('Fejl ved oprettelse af Twilio klient:', error.message);
    }
}


// Værters telefonnumre 
const værtTelefonnumre = {
    'Anna': '+4528684727',  // Emils nr 
    'Tim': '+4591977138'    // Meda nr
};

//Variabel(Dictionary) til at putte numre ind i
let telefonNumre = {};

//Funktion til at gemme telefon numre
function gemTelefonNumre() {
    // Opret data mappen, hvis den ikke findes
    const dataPakke = path.dirname(telefonNumreFil);

    // existsSync søger efter filen, hvis den ikke findes, opret den
    if (!fs.existsSync(dataPakke)) {
        // mkdirSync opretter mappen, hvis den ikke findes
        fs.mkdirSync(dataPakke, { recursive: true }); 
    }
    // writeFileSync skriver data til filen, JSON.stringify konverterer objektet til en JSON streng
    //"telefonNumre" indeholder den information vi vil have ind i "telefonNumreFil", null = tag alt med, 2 opsæt pænt
    fs.writeFileSync(telefonNumreFil, JSON.stringify(telefonNumre, null, 2));
}

//Funktion til at læse "telefonNumreFil" filen
function laesTelefonNumre() {

    //console.log("****** Prøver at læse JSON fil *************");
    let telefonNumreIndhold;

    try{
        //Sætter information fra filen ind i variablen
        telefonNumreIndhold =  fs.readFileSync(telefonNumreFil, 'utf8');

        // Sikre at det er splittet op i linjer
        const lines = telefonNumreIndhold.split('\n');
        // Dette skal fyldes med de "rene" telefonumre
        const dictionary = {};

        //Looper gennem linjerne
        lines.forEach((line)=>{
            //console.log("****line*****");
            //console.log(line);

            // Udelukker de linjer der kun indeholde "{" eller "}"
            if (!line.includes("{")&&!line.includes("}")){
                // trim linjen først
                const trimmedLine = line.trim();

                // find første kolon — hvis ingen kolon, spring over
                const index = trimmedLine.indexOf(':');
                if (index === -1) return;

                // Key får værdien af navnet på variablen
                let key = trimmedLine.slice(0, index).trim();
                // Value bliver sæt til værdien (Telefon nummeret)
                let value = trimmedLine.slice(index + 1).trim();

                // Fjern omkringliggende anførselstegn (single eller double) fra key og value
                key = key.replace(/^['"]+|['"]+$/g, '');
                value = value.replace(/^['"]+|['"]+$/g, '');

                //Sletter alle unødvendige tegn i value
                value = value
                    // fjern ydre anførselstegn igen
                    .replace(/^['"]+|['"]+$/g, '')
                    // fjerner slut ":" eller ","
                    .replace(/",?$/, '')
                    // fjerner slut komma
                    .replace(/,$/, '')               
                    .trim();

                // Sætter value info ind i key/lig med key i dictionary variablen
                dictionary[key] = value;
            }
        });

        return dictionary;

    } catch (error) {
        console.error('Fejl i forbindelse med laesning af telefonNumre.json fil.', error.message);
    }


}


// Send første SMS til vært og bekræftelse til afsender
async function sendSMSTilVært(beskedData) {
    // kollabside.html bygger beskedens objekt og det er her vi bruger det til Twilio
    // Find Vært B's telefonnummer (den der modtager beskeden)
    const værtBsTlf = værtTelefonnumre[beskedData.eventInfo.host];
    
    //Finder vært A's telefonnummer(Den der har sendt beskeden)
    let værtAsTlf = beskedData.senderPhone


    /********Gemmer begge telefonnumre i vores globale telefonNumre variable*******/
    // Sikre at vi kan ud fra 1 given vært, kan få den modsatte værts telefonnummer.

    // Vært B's nummer(Key) -> Vært A's nummer(Value) 
    // Gør så Vært B kan finde og skrive til vært A's telefonnummer)
    telefonNumre[værtBsTlf] = værtAsTlf;

    // Vært A's nummer(Key) -> Vært B's nummer(Value)
    // Gør så Vært A kan finde og skrive til vært B's telefonnummer)
    telefonNumre[værtAsTlf] = værtBsTlf;

    //console.log("****TelefonNumre*****");
    //console.log(telefonNumre);
    
    // Gem til filen
    gemTelefonNumre();
    
    // Opret SMS tekst der skal sendes til *********Vært B**********
    const smsBesked = 
`Ny samarbejde-anmodning!

Fra vært: ${beskedData.senderName}
Du kan også kontakte denne vært på: ${værtAsTlf}
Omkring dette af dine events: ${beskedData.eventInfo.title}

Besked:
${beskedData.messageText}
Svar på denne SMS for at kontakte ${beskedData.senderName}.
- Understory`.trim();

        //*******Test og debug*******//
        //console.log("*****Dato2025*******");
        //console.log("*****Når vi hertil? Twilio.js*****");
        //console.log(client.messages);
        //console.log("*****Besked*****");
        //console.log(smsBesked);        
        //console.log("twilioPhoneNumber: " + twilioPhoneNumber);
        //console.log("værtAsTlf: " + værtAsTlf);
        //console.log("værtBsTlf: " + værtBsTlf);
        //console.log("***** Client *******");
        //console.log(client);
    
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
    
    await client.messages.create({
        body: bekræftelsesBesked,
        from: twilioPhoneNumber,
        to: værtAsTlf
    });
    
   //console.log("*****Return****");
   //console.log(message.sid);
   //console.log(værtBsTlf);
    
    return { 
        success: true,
        messageSid: message.sid,
        værtTelefon: værtBsTlf
    };
}


// Funktion der håndtere al kommunikation mellem værterne(Efter den første besked)
// Bliver kaldet af vores webhook, som ligger i webhookController.js
async function håndterIndkommendeSMS(fraNummer, twilioNummer, beskedTekst) {
    //console.log("*****Client i håndterIndkommendeSMS******");
    //console.log(client);

    // Ekstra tjek om twilio er sat rigtigt op
    if (!client) {
        return console.log("*****Fejl i hentning af info fra Twilio*****");
    }

    console.log("*****håndterIndkommendeSMS indhold*****");
    console.log(fraNummer +":"+ twilioNummer + ":"+ beskedTekst);

    //Kalder function "læsTelefonNumre", således at vi kender begge værters telefonnummer her
    console.log("*****Indlæsning af telefon numre****");
    let telefonNumre_dict = laesTelefonNumre();

    //console.log(telefonNumre_dict);
    //console.log(telefonNumre_dict[fraNummer]);

    //Vi kender det nummer der har afsendt sms'en, derfor slår vi modtager nummer op ved hjælp af json fil.
    let tilNummer = telefonNumre_dict[fraNummer];

    //console.log("*****Alle numre****");
    //console.log(fraNummer);
    //console.log(twilioNummer);
    //console.log(tilNummer);

    // Sender til det modsatte nummer af fraNummer
    if (tilNummer) {
        //console.log("*****Vi kommer ind i if statment****");

        // Send besked videre
        await client.messages.create({
            body: `Svar fra vært:\n\n${beskedTekst}\n\nSvar på denne SMS for at fortsætte samtalen.\n\n- Understory`,
            from: twilioPhoneNumber,
            to: tilNummer // 
        });
    }
}
//Gør at vi kan bruge funktioner andre steder
module.exports = {
    sendSMSTilVært, 
    håndterIndkommendeSMS
};
