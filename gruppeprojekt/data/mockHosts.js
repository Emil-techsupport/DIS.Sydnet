// Mock database for Understory værter (kunder)
// Simulerer Understory's kunder der tilbyder oplevelser

const hosts = [
  {
    værtID: 1,
    navn: "Anna",
    email: "anna@understory.dk",
    password: "anna123", // Simpelt password for test
    telefonNr: "+4591977138", // Medas nr
    lokation: "København",
    apiUrl: "https://jsonplaceholder.typicode.com/posts" // idk om vi skal bruge det 
  },
  {
    værtID: 2,
    navn: "Tim",
    email: "tim@understory.dk",
    password: "tim123", // Simpelt password for test
    telefonNr: "+4591977138", // Medas nr
    lokation: "København",
    apiUrl: "https://jsonplaceholder.typicode.com/users" // idk om vi skal bruge det 
  }
];

// Funktion til at finde vært efter email og password
function findHostByCredentials(email, password) {
  return hosts.find(host => host.email === email && host.password === password);
}

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


module.exports = {
  hosts,
  getAllHosts,
  getHostById,
  getHostsByLocation,
  findHostByCredentials
};

