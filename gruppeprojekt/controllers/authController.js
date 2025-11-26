// Controller til login/logout
const jwt = require('jsonwebtoken');
const util = require('util');
require('dotenv').config();

const { findHostMedEmailOgPassword, getHostById } = require('../data/mockHosts');

const SECRET = process.env.SECRET;
const signAsync = util.promisify(jwt.sign);
const verifyAsync = util.promisify(jwt.verify);

// Cookie indstillinger (samme overalt)
const cookieOptions = {
  httpOnly: true, // kun tilgængelig for HTTP requests
  secure: true, // Altid true for HTTPS (produktion)
  sameSite: 'lax'  // sikrer at cookies ikke sendes til andre websites


};

// Login - når bruger logger ind
async function login(req, res) {
  const { email, password } = req.body;
  
  // Tjek om email og password er givet
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email og password påkrævet'
    });
  }
  
  // Find vært med email og password ved brug af hashing funktionen fra mockHosts.js
  const host = await findHostMedEmailOgPassword(email, password);
  
  if (!host) {
    return res.status(401).json({
      success: false,
      message: 'Forkert email eller password'
    });
  }
  
  // Opret JWT token med vært information med brugerens informationer
  const payload = {
    sub: `host:${host.værtID}`,
    navn: host.navn,
    email: host.email,
    værtID: host.værtID
  };
  // Opret indstillinger for token
  const signOptions = {
    algorithm: 'HS256', // samme nøgle til signere og verificere
    expiresIn: '1h', // 1 time
    issuer: 'understory-app' 
  };
  
  // Tjek om SECRET er sat (vigtigt for produktion)
  if (!SECRET) {
    console.error('❌ FEJL: SECRET ikke fundet i .env filen!');
    return res.status(500).json({
      success: false,
      message: 'Server konfigurationsfejl: SECRET mangler'
    });
  }
  
  try {
    // vi kryptere vores token så man ikke kan læse det fordi der er jo bruger informationer i det og sikrer at det er autentisk
    const token = await signAsync(payload, SECRET, signOptions);
    
    // Gem JWT token i HTTP-only cookie
    res.cookie('jwt', token, {
      maxAge: 86400000, // 24 timer
      ...cookieOptions
    });
    
    // Send svar tilbage
    res.json({
      success: true,
      message: 'Login succesfuldt',
      host: {
        navn: host.navn,
        email: host.email
      }
    });
  } catch (error) {
    console.error('❌ Fejl ved oprettelse af JWT token:', error.message);
    console.error('Error details:', error);
    return res.status(500).json({
      success: false,
      message: 'Fejl ved login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Logout - når bruger logger ud
function logout(req, res) {
  // Slet JWT cookie
  res.clearCookie('jwt', cookieOptions);
  
  res.json({
    success: true,
    message: 'Logout succesfuldt'
  });
}

// Middleware til at verificere JWT token fra cookie
async function checkAuth(req, res, next) {
  const token = req.cookies.jwt; // Hent token fra cookie
  
  // Hvis ingen token, redirect til login side
  if (!token) {
    return res.redirect('/login');
  }
  
  try {
    // Verificer token altå passer det med vores SECRET for brugeren
    const decoded = await verifyAsync(token, SECRET);

    // Dette:
// Tjekker om signaturen er korrekt (bruger samme SECRET)
// Tjekker om tokenet er udløbet
//  Returnerer payload hvis alt er OK

    // Find vært fra token fordi vi har værtID i token
    const host = getHostById(decoded.værtID);
    
    // Hvis vært ikke findes, slet cookie og redirect
    if (!host) {
      res.clearCookie('jwt', cookieOptions);
      return res.redirect('/login');
    }
    
    // Tilføj vært info til request
    req.user = host;
    next(); // Fortæller at vi kan fortsætte med requesten
  } catch (error) {
    // Token er ugyldig eller udløbet
    res.clearCookie('jwt', cookieOptions);
    return res.redirect('/login');
  }
}

module.exports = {
  login,
  logout,
  checkAuth
};
