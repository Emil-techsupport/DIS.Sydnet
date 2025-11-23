//Henter funktion til at få fat i alle vores hosts fra mockHosts.js
const {getAllHosts } = require("./mockHosts");

//Opretter variable med events indeni
const mockEvents = {
  // Events der tilhører Anna(Anna er logget ind, derfor ses disse events på forsiden)
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
      lokation: "København",
      kategori: "Health & Yoga",
      eventkapacitet: "35 personer"
    },
    {
      værtID: 1,
      id: 5,
      titel: "Aarhus Street Food Tour",
      beskrivelse: "Oplev Aarhus' bedste street food med lokale guider. Smag på autentisk dansk mad.",
      varighed: "3 timer",
      pris: 400,
      dato: "2025-12-20",
      tidspunkt: "12:00",
      samarbejde: false,
      lokation: "Aarhus",
      kategori: "Tours",
      eventkapacitet: "25 personer"
    },
    {
      værtID: 1,
      id: 2,
      titel: "Vinproveri med Lokale Vingårde",
      beskrivelse: "Smag på udvalgte vine fra danske vingårde. Lær om vinens historie og smagsnoter.",
      varighed: "2 timer",
      pris: 350,
      dato: "2025-12-20",
      tidspunkt: "18:00",
      samarbejde: false,
      lokation: "København",
      kategori: "Food & Tastings",
      eventkapacitet: "15 personer"
    },
    {
      værtID: 1,
      id: 6,
      titel: "test",
      beskrivelse: "Start dagen med en afslappende yoga-session i det smukke solskin. Perfekt til at finde ro og balance.",
      varighed: "60 minutter",
      pris: 150,
      dato: "2025-12-20",
      tidspunkt: "08:00",
      samarbejde: true,
      lokation: "København",
      kategori: "Health & Yoga",
      eventkapacitet: "35 personer"
    }
  ],

  // Events der tilhører Tim(Events som Anna kan samarbejde med)
  timsEvents: [
    {
      værtID: 2,
      id: 2,
      titel: "Vinproveri med Lokale Vingårde",
      beskrivelse: "Smag på udvalgte vine fra danske vingårde. Lær om vinens historie og smagsnoter.",
      varighed: "2 timer",
      pris: 350,
      dato: "2025-12-20",
      tidspunkt: "18:00",
      samarbejde: false,
      lokation: "København",
      kategori: "Food & Tastings",
      eventkapacitet: "15 personer"
    },
    {
      værtID: 2,
      id: 3,
      titel: "Traditionel Finsk Sauna",
      beskrivelse: "Oplev autentisk finsk sauna med afslappende atmosfære. Inkluderer afkøling i fjorden.",
      varighed: "90 minutter",
      pris: 200,
      dato: "2025-12-20",
      tidspunkt: "16:00",
      samarbejde: true,
      lokation: "Aarhus",
      kategori: "Health & Yoga",
      eventkapacitet: "10 personer"
    },
    {
      værtID: 2,
      id: 3,
      titel: "Traditionel Finsk Sauna",
      beskrivelse: "Oplev autentisk finsk sauna med afslappende atmosfære. Inkluderer afkøling i fjorden.",
      varighed: "90 minutter",
      pris: 200,
      dato: "2025-12-20",
      tidspunkt: "16:00",
      samarbejde: true,
      lokation: "Aarhus",
      kategori: "Health & Yoga",
      eventkapacitet: "10 personer"
    }
  ]
};



// Funktion til at få alle events baseret på givent vært navn
function getEventsByHostName(værtNavn) {
  
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

