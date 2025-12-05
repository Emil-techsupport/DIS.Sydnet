// Controller til login/logout
const jwt = require('jsonwebtoken');
const util = require('util');
require('dotenv').config();

const { findHostMedEmailOgPassword, getHostById } = require('../data/mockHosts');

const SECRET = process.env.SECRET;
const signAsync = util.promisify(jwt.sign);
const verifyAsync = util.promisify(jwt.verify);

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
  
  try {
    // vi kryptere vores token så man ikke kan læse det fordi der er jo bruger informationer i det og sikrer at det er autentisk
    const token = await signAsync(payload, SECRET, signOptions);
    
    // Gem JWT token i HTTP-only cookie med max age 1 time
    // secure: true kun i production (HTTPS), false i development (HTTP)
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('jwt', token, {
      maxAge: 3600000, // 1 time (3600000ms = 60 min * 60 sek * 1000ms)
      httpOnly: true, // Sikrer at JavaScript ikke kan læse cookie (sikkerhed)
      secure: isProduction, // Kun send cookie over HTTPS i production
      sameSite: 'lax', // Beskytter mod CSRF angreb, tillader cross-site requests
      path: '/' // Cookie gælder for alle routes
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
    console.error('Fejl ved oprettelse af JWT token:', error);
    return res.status(500).json({
      success: false,
      message: 'Fejl ved login'
    });
  }
}

// Logout - når bruger logger ud
function logout(req, res) {
  // Slet JWT cookie (skal have samme indstillinger som ved oprettelse)
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/'
  });
  
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
      res.clearCookie('jwt');
      return res.redirect('/login');
    }
    
    // Tilføj vært info til request
    req.user = host;
    next(); // Fortæller at vi kan fortsætte med requesten
  } catch (error) {
    // Token er ugyldig eller udløbet
    res.clearCookie('jwt');
    return res.redirect('/login');
  }
}

module.exports = {
  login,
  logout,
  checkAuth
};
