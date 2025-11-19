// Mock events/oplevelser data på dansk
// Dansk data til at erstatte jsonplaceholder API

const mockEvents = {
  // Events for Yoga by Anna
  yogaEvents: [
    {
      id: 1,
      title: "Morgen Yoga i Solen",
      beskrivelse: "Start dagen med en afslappende yoga-session i det smukke solskin. Perfekt til at finde ro og balance.",
      varighed: "60 minutter",
      pris: 150,
      dato: "2024-12-20",
      tid: "08:00"
    },
    {
      id: 2,
      title: "Yin Yoga Aften",
      beskrivelse: "Afslappende yin yoga med fokus på dyb afslapning og stressreduktion. Ideel efter en lang dag.",
      varighed: "75 minutter",
      pris: 180,
      dato: "2024-12-21",
      tid: "19:00"
    },
    {
      id: 3,
      title: "Power Yoga Workshop",
      beskrivelse: "Intensiv power yoga session for at bygge styrke og fleksibilitet. For både begyndere og øvede.",
      varighed: "90 minutter",
      pris: 220,
      dato: "2024-12-22",
      tid: "10:00"
    }
  ],

  // Events for Vin & Fjord
  vinEvents: [
    {
      id: 1,
      title: "Vinproveri med Lokale Vingårde",
      beskrivelse: "Smag på udvalgte vine fra danske vingårde. Lær om vinens historie og smagsnoter.",
      varighed: "2 timer",
      pris: 350,
      dato: "2024-12-20",
      tid: "18:00"
    },
    {
      id: 2,
      title: "Fjordens Smagsoplevelse",
      beskrivelse: "Kombiner vin med lokale delikatesser fra fjorden. En komplet smagsoplevelse.",
      varighed: "3 timer",
      pris: 450,
      dato: "2024-12-21",
      tid: "19:00"
    },
    {
      id: 3,
      title: "Champagne Aften",
      beskrivelse: "Elegant aften med champagne og ost. Perfekt til en særlig begivenhed.",
      varighed: "2.5 timer",
      pris: 500,
      dato: "2024-12-22",
      tid: "20:00"
    }
  ],

  // Events for Sauna & Silence
  saunaEvents: [
    {
      id: 1,
      title: "Traditionel Finsk Sauna",
      beskrivelse: "Oplev autentisk finsk sauna med afslappende atmosfære. Inkluderer afkøling i fjorden.",
      varighed: "90 minutter",
      pris: 200,
      dato: "2024-12-20",
      tid: "16:00"
    },
    {
      id: 2,
      title: "Sauna & Meditation",
      beskrivelse: "Kombiner sauna med guided meditation for maksimal afslapning og mental klarhed.",
      varighed: "2 timer",
      pris: 280,
      dato: "2024-12-21",
      tid: "18:00"
    },
    {
      id: 3,
      title: "Aften Sauna under Stjernerne",
      beskrivelse: "Romantisk sauna-oplevelse om aftenen med udsigt til stjernehimlen.",
      varighed: "2 timer",
      pris: 320,
      dato: "2024-12-22",
      tid: "20:00"
    }
  ],

  // Events for Copenhagen Adventures
  adventureEvents: [
    {
      id: 1,
      title: "Kajak Tur gennem Kanalerne",
      beskrivelse: "Udforsk Københavns kanaler fra vandet. Se byen fra en helt ny vinkel.",
      varighed: "2.5 timer",
      pris: 300,
      dato: "2024-12-20",
      tid: "14:00"
    },
    {
      id: 2,
      title: "Cykel Eventyr gennem Byen",
      beskrivelse: "Guidet cykeltur til Københavns skjulte perler og lokale favoritsteder.",
      varighed: "3 timer",
      pris: 250,
      dato: "2024-12-21",
      tid: "10:00"
    },
    {
      id: 3,
      title: "Klatring på Indendørs Væg",
      beskrivelse: "Prøv klatring i Københavns bedste klatrecenter. Vejledning inkluderet.",
      varighed: "2 timer",
      pris: 280,
      dato: "2024-12-22",
      tid: "16:00"
    }
  ],

  // Events for Aarhus Food Tours
  foodTourEvents: [
    {
      id: 1,
      title: "Aarhus Street Food Tour",
      beskrivelse: "Oplev Aarhus' bedste street food med lokale guider. Smag på autentisk dansk mad.",
      varighed: "3 timer",
      pris: 400,
      dato: "2024-12-20",
      tid: "12:00"
    },
    {
      id: 2,
      title: "Lokale Markeder & Smagsoplevelser",
      beskrivelse: "Besøg Aarhus' lokale markeder og smag på friske lokale produkter.",
      varighed: "2.5 timer",
      pris: 350,
      dato: "2024-12-21",
      tid: "11:00"
    },
    {
      id: 3,
      title: "Aften Food Tour med Lokale Chefer",
      beskrivelse: "Eksklusiv aften med møde lokale chefer og smag på deres signaturretter.",
      varighed: "4 timer",
      pris: 550,
      dato: "2024-12-22",
      tid: "18:00"
    }
  ]
};

// Funktion til at få events baseret på vært navn
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

// Funktion til at få et tilfældigt event fra en vært
function getRandomEvent(værtNavn) {
  const events = getEventsByHost(værtNavn);
  if (events.length === 0) return null;
  return events[Math.floor(Math.random() * events.length)];
}

module.exports = {
  mockEvents,
  getEventsByHost,
  getRandomEvent
};

