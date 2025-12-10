/*****Controller til login/logout*******/
//Gør det muligt at bruge jsonwebtokens
const jwt = require('jsonwebtoken');
const util = require('util');
require('dotenv').config();

//Gør det muligt at bruge funktioner fra mockhosts
const { findHostMedEmailOgPassword, getHostById } = require('../data/mockHosts');

//Læser vores secret key, 
const SECRET = process.env.SECRET;
const signAsync = util.promisify(jwt.sign);
const verifyAsync = util.promisify(jwt.verify);

// Login - når bruger logger ind
// Route bliver kaldt i login.html og sendt videre hertil fra authRoutes.js
async function login(req, res) {
  //Får email og password ud
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
    // vi kryptere vores token, så man ikke kan læse det.
    const token = await signAsync(payload, SECRET, signOptions);
    
    // secure: true kun i production (HTTPS), false i development (HTTP)
    const isProduction = process.env.NODE_ENV === 'production';

    // Gem JWT token i cookie(max 1 time)
    res.cookie('jwt', token, {
      maxAge: 3600000, // 1 time (3600000ms = 60 min * 60 sek * 1000ms)
      httpOnly: true, // Sikrer at JavaScript ikke kan læse cookie (sikkerhed)
      secure: isProduction, // Kun send cookie over HTTPS i production
      sameSite: 'lax', // Beskytter mod CSRF angreb, tillader cross-site requests
      path: '/' // Cookie gælder for alle routes
    });
    
    // Send svar tilbage til login.html
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
  const isProduction = process.env.NODE_ENV === 'production';
  // Slet JWT cookie (skal have samme indstillinger som ved oprettelse)
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: isSecure,
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

    // Overstående linje tjekker følgende:
      // Tjekker om signaturen er korrekt (bruger samme SECRET)
      // Tjekker om tokenet er udløbet
      // Returnerer payload hvis alt er OK

    // Find vært fra token fordi vi har værtID i token
    const host = getHostById(decoded.værtID);
    
    // Hvis vært ikke findes, slet cookie og redirect tilbage til log ind
    if (!host) {
      res.clearCookie('jwt');
      return res.redirect('/login');
    }
    
    // Tilføj vært info til request
    req.user = host;
    // Fortæller at vi kan fortsætte med requesten
    next(); 

  } catch (error) {
    // Token er ugyldig eller udløbet
    res.clearCookie('jwt');
    return res.redirect('/login');
  }
}

//Gør at vi kan bruge følgende funktioner andre steder.
module.exports = {
  login,
  logout,
  checkAuth
};
