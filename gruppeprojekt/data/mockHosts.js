// Mock database for Understory værter (kunder)
// Simulerer Understory's kunder der tilbyder oplevelser

const bcrypt = require('bcryptjs');

const hosts = [
  {
    værtID: 1,
    navn: "Anna",
    email: "anna@understory.dk",
    password: "$2b$10$9bOXFXIjk6qoDXRW63B0NOcRdCPjZaPIzYmZyetPEgAAp.aBENfGG", // hashed password, "anna123"
    telefonNr: "+4591977138", // Medas nr
    lokation: "København",
    apiUrl: "https://jsonplaceholder.typicode.com/posts" // idk om vi skal bruge det 
  },
  {
    værtID: 2,
    navn: "Tim",
    email: "tim@understory.dk",
    password: "$2b$10$rxMOn2eloHoGyyvquer.2u.8DcjjH1GF9zB7CpPOSF91AgxQKX/Fq", // hashed password, "tim123"
    telefonNr: "+4591977138", // Medas nr
    lokation: "København",
    apiUrl: "https://jsonplaceholder.typicode.com/users" // idk om vi skal bruge det 
  }
];

// Funktion til at finde vært efter email og password
async function findHostMedEmailOgPassword(email, password) {
  // Find host med email først
  const host = hosts.find(host => host.email === email);
  
  // Hvis host ikke findes, returner undefined
  if (!host) {
    return undefined;
  }
  
  // Verificer password med bcrypt
  const isPasswordMatch = await bcrypt.compare(password, host.password);
  
  // Hvis password matcher, returner host, ellers undefined
  if (isPasswordMatch) {
    return host;
  } else {
    return undefined;
  }
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
  findHostMedEmailOgPassword
};

// TEST: 
//const result = getAllHosts();
//console.log(result);