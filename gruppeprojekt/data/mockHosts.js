// Mock database for Understory værter (kunder)
// Simulerer Understory's kunder der tilbyder oplevelser
const bcrypt = require('bcryptjs');
// Sikre at dotenv er indlæst først
require('dotenv').config();
const { encrypt, decrypt } = require('../services/encryption');

// Krypter telefonnumre ved oprettelse (kun én gang)
const hosts = [
  {
    værtID: 1,
    navn: "Anna",
    email: encrypt("anna@understory.dk"),
    password: "$2b$10$9bOXFXIjk6qoDXRW63B0NOcRdCPjZaPIzYmZyetPEgAAp.aBENfGG", // hashed password, "anna123"
    telefonNr: encrypt("+4528684727"), // Krypteret telefonnummer
    lokation: "København",
    apiUrl: "https://jsonplaceholder.typicode.com/posts" // idk om vi skal bruge det 
  },
  {
    værtID: 2,
    navn: "Tim",
    email: encrypt("tim@understory.dk"),
    password: "$2b$10$rxMOn2eloHoGyyvquer.2u.8DcjjH1GF9zB7CpPOSF91AgxQKX/Fq", // hashed password, "tim123"
    telefonNr: encrypt("+4531903444"), // Krypteret telefonnummer
    lokation: "København",
    apiUrl: "https://jsonplaceholder.typicode.com/users" // idk om vi skal bruge det 
  }
];

// Funktion til at finde vært efter email og password
async function findHostMedEmailOgPassword(email, password) {
  // Gennemgå alle hosts og dekrypter email for at sammenligne
  for (let i = 0; i < hosts.length; i++) {
    const host = hosts[i];
    const dekrypteretEmail = decrypt(host.email);
    
    // Hvis email matcher, tjek password
    if (dekrypteretEmail === email) {
      // Verificer password med bcrypt
      const erPasswordGood = await bcrypt.compare(password, host.password);
      
      // Hvis password matcher, returner host (med dekrypteret telefonNr og email)
      if (erPasswordGood) {
        return decryptHostTlfOgMail(host);
      } else {
        return undefined; // Password matcher ikke
      }
    }
  }
  // Hvis ingen host findes med denne email, returner undefined
  return undefined;
}

//***************Krypterings funktioner********************//

// Hjælpe funktion til at dekryptere telefonNr og email i host objekt
function decryptHostTlfOgMail(host) {
  if (!host) return host;
  return {
    ...host,
    telefonNr: decrypt(host.telefonNr), // Dekrypter telefonnummer
    email: decrypt(host.email) // Dekrypter email
  };
}

// Funktioner til at hente hosts (dekrypterer telefonNr og email automatisk)
function getAllHosts() {
  const result = [];
  for (let i = 0; i < hosts.length; i++) {
    result.push(decryptHostTlfOgMail(hosts[i])); // Dekrypter telefonnummer og email
  }
  return result; // Returnerer alle hosts med dekrypteret telefonNr og email
}

function getHostById(værtID) {
  for (let i = 0; i < hosts.length; i++) {
    if (hosts[i].værtID === værtID) {
      return decryptHostTlfOgMail(hosts[i]); // Returnerer host med dekrypteret telefonNr og email
    }
  }
  return undefined;
}

function getHostsByLocation(lokation) {
  const result = [];
  for (let i = 0; i < hosts.length; i++) {
    if (hosts[i].lokation === lokation) {
      result.push(decryptHostTlfOgMail(hosts[i])); // Dekrypter telefonnummer og email
    }
  }
  return result; // Returnerer alle hosts med dekrypteret telefonNr og email
}


module.exports = {
  getAllHosts,
  getHostById,
  getHostsByLocation,
  findHostMedEmailOgPassword
};

/**********Testing***********/
// ************** test **************
//let result = getAllHosts();
//console.log(result);
 //************** test **************
//let result = getHostById(1);
//console.log(result);
 //************** test **************
//let result = getHostsByLocation("København");
//console.log(result);
 //************** test **************
//let result = findHostMedEmailOgPassword("anna@understory.dk", "anna123");
//console.log(result);
// ************** test **************