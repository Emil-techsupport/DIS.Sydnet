// Mock events/oplevelser data på dansk
// Dansk data til at erstatte jsonplaceholder API

const {getAllHosts } = require("./mockHosts");

const mockEvents = {
  // Events der tilhører Anna
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

  // Events der tilhører Tim
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



// Funktion til at få events baseret på værtnavn part 2
function getEventsByHost2(værtNavn) {
  
  let alleHosts = getAllHosts();
  let alleEvents = mockEvents;
  console.log("******Alle hosts******+")
  console.log(alleHosts);

  let hostId;

  for (let i = 0; i < alleHosts.length; i++) {
    if (alleHosts[i].navn == værtNavn) {
        hostId = alleHosts[i].værtID;
        break;
    }
  }

  console.log("******Host ID*****")
  console.log(hostId);

  
  //console.log("*****alleEvents");
  //console.log(alleEvents);
  //console.log("*****Event 0 ID******");
  //console.log(alleEvents[0]);

  let bestemtHostEvents = [];

  for (const liste of Object.values(alleEvents)) {
    for (const event of liste) {
      if (event.værtID === hostId) {
        bestemtHostEvents.push(event);
      }
    }
  };

  console.log("******Events der tilhører given Host(udfra værtID)*****")
  console.log(bestemtHostEvents);

  return[bestemtHostEvents];
}

/*
// Funktion til at få events baseret på værtnavn
function getEventsByHost(værtNavn) {
  switch(værtNavn) {
    case "Yoga by Anna":
      return mockEvents.yogaEvents;
    case "Vin & Fjord":
      return mockEvents.vinEvents;
    case "Sauna & Silence":
      return mockEvents.saunaEvents;
    case "Copenhagen Adventures":
      return mockEvents.adventureEvents;
    case "Aarhus Food Tours":
      return mockEvents.foodTourEvents;
    default:
      return [];
  }
}
*/


//getEventsByHost2("Anna");




// Funktion til at få et tilfældigt event fra en vært
/*
function getRandomEvent(værtNavn) {
  const events = getEventsByHost(værtNavn);
  if (events.length === 0) return null;
  return events [Math.floor(Math.random() * events.length)];
}
*/
module.exports = {
  mockEvents,
  //getEventsByHost,
  getEventsByHost2
  //getRandomEvent
};

