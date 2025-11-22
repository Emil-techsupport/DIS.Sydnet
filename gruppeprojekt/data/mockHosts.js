// Mock database for Understory værter (kunder)
// Simulerer Understory's kunder der tilbyder oplevelser

const hosts = [
  {
    værtID: 1,
    navn: "Anna",
    email: "anna@events.dk",
    telefonNr: "+45 12 34 56 78",
    lokation: "København",
    apiUrl: "https://jsonplaceholder.typicode.com/posts"
  },
  {
    værtID: 2,
    navn: "Tim",
    email: "tim@events.dk",
    telefonNr: "+45 23 45 67 89",
    lokation: "København",
    apiUrl: "https://jsonplaceholder.typicode.com/users"
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

