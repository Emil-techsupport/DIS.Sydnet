// Mock database for Understory værter (kunder)
// Simulerer Understory's kunder der tilbyder oplevelser

const hosts = [
  {
    værtID: 1,
    navn: "Yoga by Anna",
    email: "anna@yogabyanna.dk",
    telefonNr: "+45 12 34 56 78",
    lokation: "København",
    kategori: "Health & Yoga",
    apiUrl: "https://jsonplaceholder.typicode.com/posts", // Mock API endpoint
    oprettetDato: "2024-01-15",
    status: "active"
  },
  {
    værtID: 2,
    navn: "Vin & Fjord",
    email: "kontakt@vinogfjord.dk",
    telefonNr: "+45 23 45 67 89",
    lokation: "København",
    kategori: "Food & Tastings",
    apiUrl: "https://jsonplaceholder.typicode.com/users", // Mock API endpoint
    oprettetDato: "2024-02-20",
    status: "active"
  },
  {
    værtID: 3,
    navn: "Sauna & Silence",
    email: "info@saunasilence.dk",
    telefonNr: "+45 34 56 78 90",
    lokation: "Aarhus",
    kategori: "Health & Yoga",
    apiUrl: "https://jsonplaceholder.typicode.com/comments", // Mock API endpoint
    oprettetDato: "2024-03-10",
    status: "active"
  },
  {
    værtID: 4,
    navn: "Copenhagen Adventures",
    email: "hello@cphadventures.dk",
    telefonNr: "+45 45 67 89 01",
    lokation: "København",
    kategori: "Adventure",
    apiUrl: "https://jsonplaceholder.typicode.com/posts", // Mock API endpoint
    oprettetDato: "2024-01-05",
    status: "active"
  },
  {
    værtID: 5,
    navn: "Aarhus Food Tours",
    email: "info@aarhusfoodtours.dk",
    telefonNr: "+45 56 78 90 12",
    lokation: "Aarhus",
    kategori: "Tours",
    apiUrl: "https://jsonplaceholder.typicode.com/users", // Mock API endpoint
    oprettetDato: "2024-02-28",
    status: "active"
  }
];

// Funktioner til at hente hosts
function getAllHosts() {
  return hosts;
}

function getHostById(værtID) {
  return hosts.find(host => host.værtID === værtID);
}

function getHostsByLocation(lokation) {
  return hosts.filter(host => host.lokation === lokation);
}

function getHostsByCategory(kategori) {
  return hosts.filter(host => host.kategori === kategori);
}

function getActiveHosts() {
  return hosts.filter(host => host.status === "active");
}

module.exports = {
  hosts,
  getAllHosts,
  getHostById,
  getHostsByLocation,
  getHostsByCategory,
  getActiveHosts
};

