/*
Symettrisk kryptering: bruger samme nøgle til at kryptere og dekryptere data
Asymmetrisk kryptering: bruger forskellige nøgler til at kryptere og dekryptere data
*/
// Baseret på AES-256-CBC symmetrisk kryptering
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// AES 256-bit er en symmetrisk krypteringsalgoritme
// AES har en nøgle og en blokstørrelse
// Nøglen for AES kan være på 128, 192 eller 256 bits (16, 24 eller 32 bytes)
// For AES er blokstørrelsen altid 128 bit som er 16 bytes
const algorithm = 'aes-256-cbc';


// Hent encryption key fra environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

/**
 * Krypterer funktionen som tager en tekst som input og returnerer en krypteret tekst
 */
function encrypt(tekst) {

  // Generer unik IV for hver kryptering som er unik for hver kryptering
 
  const iv = crypto.randomBytes(16); // 16 bytes = 128 bits
  
  // Opret cipher med algoritme, key og IV, man bruger IV af samme grund som salt i hash funktioner 
// fordi hvis man krypterer samme tekst med samme key og IV vil man få samme output.
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY, 'hex'), // Konverter hex string til buffer, hex er en string der repræsenterer en hexadecimal værdi altså data
    iv
  );
  
  // Krypter teksten
  // update() krypterer data, final() afslutter krypteringen
  const krypteret = cipher.update(tekst, 'utf8', 'hex') + cipher.final('hex');
  
  // Returner IV + krypteret data
  // IV skal gemmes sammen med den krypterede data, så vi kan dekryptere senere
  // Format: "iv:encrypted" (begge i hex, adskilt med ':')
  return iv.toString('hex') + ':' + krypteret;
}

/**
 * Dekrypterer tekst med AES-256-CBC

 */
function decrypt(krypteretData) {

    // 1. Hent IV og krypteret data. altså vi spliter iv fra selve teksten som er krypteret.
  const dele = krypteretData.split(':');
  const iv = Buffer.from(dele[0], 'hex'); // Første del er IV 
  const krypteretTekst = dele[1]; // Anden del er den krypterede tekst
  
  // Opret decipher med algoritme med samme key og IV
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  
  // Dekrypter teksten
  // update() dekrypterer data, final() afslutter dekrypteringen
  const dekrypteret = decipher.update(krypteretTekst, 'hex', 'utf8') + decipher.final('utf8');
  
  return dekrypteret;
}

module.exports = {
  encrypt,
  decrypt
};
// Bare for os ********************* *********************
// Original tekst: "+4591977138"
// ↓ Krypteret med AES-256-CBC
// Hex cipher: "327f2a70f21b2d14c131a188bd8d2233" 
// ↓ Dekrypteret med samme nøgle + IV
// Original tekst: "+4591977138"
// ********************* *********************