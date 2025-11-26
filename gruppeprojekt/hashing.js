const bcrypt = require('bcryptjs');
const {getAllHosts} = require('./data/mockHosts');

// Antallet af salt runder (cost factor)
const saltRounds = 10;

// Funktion til at hashe et password
async function hashPassword(plainPassword) {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds); // hashPassword funktionen hashar passwordet og sætter salt på
   // console.log("Hashed Password:", hashedPassword);
    return hashedPassword;
}

// Funktion til at verificere et password
async function verifyPassword(plainPassword, hashedPassword) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
   // console.log("Password Match:", isMatch);
    return isMatch;
}

// Funktion til at hashe alle brugeres passwords
async function hashBrugerPassword() {
    let alleHosts = getAllHosts();
    
    for (let i = 0; i < alleHosts.length; i++) {
        let host = alleHosts[i];
        let adgangkode = host.password;
        
        // Hash passwordet ved at bruge hashPassword funktionen
        let hashedAdgangkode = await hashPassword(adgangkode);
        
        // *************************TEST*************************
       console.log(`${host.navn} (${host.email}):`);
        console.log(`Adgangskode: ${adgangkode}`);
        console.log(`Hashed adgangskode: ${hashedAdgangkode}`);
       
    }
}

module.exports = {
    hashPassword,
    verifyPassword,
    hashBrugerPassword
};

// ****************TEST****************
hashBrugerPassword();