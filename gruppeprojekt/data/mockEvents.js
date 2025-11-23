// Mock events/oplevelser data på dansk
// Dansk data til at erstatte jsonplaceholder API

const {getAllHosts } = require("./mockHosts");

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
      lokation: "København",
      kategori: "Health & Yoga",
      eventkapacitet: "35 personer"
    },
    {
      værtID: 1,
      id: 2,
      titel: "Aften Yoga ved Candlelight",
      beskrivelse: "Afslappende yoga-session ved levende lys. Perfekt til at afslutte dagen med ro og mindfulness.",
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
      titel: "Power Yoga for Begyndere",
      beskrivelse: "Dynamisk yoga-session for begyndere. Byg styrke og fleksibilitet i et støttende miljø.",
      varighed: "60 minutter",
      pris: 160,
      dato: "2025-12-22",
      tidspunkt: "10:00",
      samarbejde: true,
      lokation: "København",
      kategori: "Health & Yoga",
      eventkapacitet: "25 personer"
    }
  ],

  // Events der tilhører Tim (Vin sted)
  timsEvents: [
    {
      værtID: 2,
      id: 1,
      titel: "Vinproveri med Lokale Vingårde",
      beskrivelse: "Smag på udvalgte vine fra danske vingårde. Lær om vinens historie og smagsnoter fra eksperter.",
      varighed: "2 timer",
      pris: 350,
      dato: "2025-12-20",
      tidspunkt: "18:00",
      samarbejde: true,
      lokation: "København",
      kategori: "Food & Tastings",
      eventkapacitet: "15 personer"
    },
    {
      værtID: 2,
      id: 2,
      titel: "Rødvin Aften med Ost",
      beskrivelse: "Oplev en eksklusiv aften med udvalgte rødvine og lækre oste. Perfekt kombination af smag og atmosfære.",
      varighed: "2.5 timer",
      pris: 450,
      dato: "2025-12-21",
      tidspunkt: "19:30",
      samarbejde: true,
      lokation: "København",
      kategori: "Food & Tastings",
      eventkapacitet: "12 personer"
    },
    {
      værtID: 2,
      id: 3,
      titel: "Champagne & Bubbles",
      beskrivelse: "Fejr med champagne og bobler. Smag på forskellige champagner og lær om boblenes verden.",
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

