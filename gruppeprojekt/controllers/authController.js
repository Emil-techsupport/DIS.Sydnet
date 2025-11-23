// Controller til login/logout

const { findHostByCredentials, getHostById } = require('../data/mockHosts');

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
  
  // Find vært med email og password
  const host = findHostByCredentials(email, password);
  
  if (!host) {
    return res.status(401).json({
      success: false,
      message: 'Forkert email eller password'
    });
  }
  
  // Gem vært ID i cookie
  res.cookie('loggedInHostId', host.værtID, {
    maxAge: 86400000, // 1 dag idk om det er nok 
    httpOnly: true // dette sikrer at cookie ikke kan acesses af javascript
  });
  
  // Gem vært navn i cookie
  res.cookie('loggedInHostName', host.navn, {
    maxAge: 86400000,
    httpOnly: true
  });
  
  console.log('Cookie oprettet:', {
    loggedInHostId: host.værtID,
    loggedInHostName: host.navn
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
}

// Logout - når bruger logger ud
function logout(req, res) {
  // Slet cookies
  res.clearCookie('loggedInHostId');
  res.clearCookie('loggedInHostName');
  
  console.log(' Cookies slettet fordi vi er logget ud');
  
  res.json({
    success: true,
    message: 'Logout succesfuldt'
  });
}

// Tjek om bruger er logget ind
function checkAuth(req, res, next) {
  const hostId = req.cookies.loggedInHostId;
  
  // Hvis ingen cookie, er bruger ikke logget ind
  if (!hostId) {
    return res.status(401).json({
      success: false,
      message: 'Ikke logget ind'
    });
  }
  
  // Find vært fra cookie ID
  const host = getHostById(parseInt(hostId));
  
  // Hvis vært ikke findes, slet cookies
  if (!host) {
    res.clearCookie('loggedInHostId');
    res.clearCookie('loggedInHostName');
    return res.status(401).json({
      success: false,
      message: 'Ugyldig session'
    });
  }
  
  // Tilføj vært info til request
  req.user = host;
  next();
}

module.exports = {
  login,
  logout,
  checkAuth
};
