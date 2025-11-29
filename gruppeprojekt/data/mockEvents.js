//Henter funktion til at få fat i alle vores hosts fra mockHosts.js
const {getAllHosts } = require("./mockHosts");

//Opretter variable med events inden i
const mockEvents = {
  // Events der tilhører Anna (Yoga sted)
  annasEvents: [
    {
      værtID: 1,
      id: 1,
      titel: "Morgen Yoga i Solen",
      beskrivelse: "Start dagen med en afslappende yoga-session i det smukke solskin. Perfekt til at finde ro og balance.",
      varighed: "60 minutter",
      pris: 150,
      dato: "2025-12-20",
      tidspunkt: "08:00",
      samarbejde: true,
      lokation: "Helsingør",
      kategori: "Health & Yoga",
      eventkapacitet: "35 personer"
    },
    {
      værtID: 1,
      id: 2,
      titel: "Aften Yoga",
      beskrivelse: "Afslappende yoga med levende lys. Perfekt til at afslutte dagen med ro og mindfulness.",
      varighed: "75 minutter",
      pris: 180,
      dato: "2025-12-21",
      tidspunkt: "19:00",
      samarbejde: true,
      lokation: "København",
      kategori: "Health & Yoga",
      eventkapacitet: "30 personer"
    },
    {
      værtID: 1,
      id: 3,
      titel: "Power Yoga for alle niveauer",
      beskrivelse: "Dynamisk yoga-session for alle. Byg styrke og fleksibilitet i et støttende miljø.",
      varighed: "60 minutter",
      pris: 160,
      dato: "2025-12-22",
      tidspunkt: "10:00",
      samarbejde: true,
      lokation: "Odense",
      kategori: "Health & Yoga",
      eventkapacitet: "25 personer"
    }
  ],

  // Events der tilhører Tim (Vin sted)
  timsEvents: [
    {
      værtID: 2,
      id: 1,
      titel: "Vinsmagning på lokale vingårde",
      beskrivelse: "Smag på udvalgte vine fra danske vingårde. Lær om vinens historie og smagsnoter fra eksperter.",
      varighed: "2 timer",
      pris: 350,
      dato: "2025-12-20",
      tidspunkt: "18:00",
      samarbejde: true,
      lokation: "Hillerød",
      kategori: "Food & Tastings",
      eventkapacitet: "15 personer"
    },
    {
      værtID: 2,
      id: 2,
      titel: "Delux pakke: Rødvin og Ost",
      beskrivelse: "Oplev en eksklusiv aften med udvalgte rødvine og lækre oste. Perfekt kombination af smag og atmosfære.",
      varighed: "2.5 timer",
      pris: 1000,
      dato: "2025-12-21",
      tidspunkt: "19:30",
      samarbejde: true,
      lokation: "København",
      kategori: "Food & Tastings",
      eventkapacitet: "8 personer"
    },
    {
      værtID: 2,
      id: 3,
      titel: "Champagnesmagning",
      beskrivelse: "Smag på forskellige champagner og lær om boblenes verden.",
      varighed: "1.5 timer",
      pris: 400,
      dato: "2025-12-22",
      tidspunkt: "17:00",
      samarbejde: true,
      lokation: "København",
      kategori: "Food & Tastings",
      eventkapacitet: "20 personer"
    }
  ]
};

// Funktion til at få alle events baseret på givent vært navn
async function getEventsByHostName(værtNavn) {
  
  //Får alle host med deres data ud i en variable der hedder "alleHosts"
  let alleHosts = getAllHosts();
  //Tager fat i alle vores events og gemmer dem i "alleEvents" variablen
  let alleEvents = mockEvents;
  
  //console.log("******Alle hosts******")
  //console.log(alleHosts);

  //Variable til at indeholde hostId'et
  let hostId;

  //For loop der kører alle vores hosts igennem
  for (let i = 0; i < alleHosts.length; i++) {
    //Hvis hosten der er taget fat i, har samme værtnavn som det der er givet så gem dens id i "hostId" og break.
    if (alleHosts[i].navn == værtNavn) {
        hostId = alleHosts[i].værtID;
        break;
    }
  }
  //console.log("******Host ID*****")
  //console.log(hostId);

  //Variabel til at indeholde alle den fundne hosts events
  let bestemtHostEvents = [];

  ////Gennemgår alle events og finder dem hvor "værtID" er ens med det "hosId" vi lige har fundet
  for (const liste of Object.values(alleEvents)) {
    for (const event of liste) {
      if (event.værtID === hostId) {
        //Hvis eventet har alle værtID og derfor tilhører hosten/værten, så push den ind i "bestemtHostEvents"
        bestemtHostEvents.push(event);
      }
    }
  };

  //console.log("******Events der tilhører given Host(udfra værtID)*****")
  //console.log(bestemtHostEvents);

  //Returner et array af alle de events der tilhører den efterspurgte/givne host
  return[bestemtHostEvents];
}

//Gør det muligt at bruge denne variabel og function i andre filer.
module.exports = {
  mockEvents,
  getEventsByHostName
};

// TEST funktionen getEventsByHostName
 // getEventsByHostName("Anna");


