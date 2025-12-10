// Gør at vi kan bruge ting fra proxyService.js
const proxyService = require('../services/proxyService');

// Hent events for en given vært
async function getHostEvents(req, res) {
  try {
    // Hent vært navn fra URL
    const hostNavn = req.query.host;
    
    // Tjek om vært navn er givet, hvis ikke så send en fejl tilbage
    if (!hostNavn) {
      return res.status(400).json({
        success: false,
        error: 'Vært navn mangler'
      });
    }
    
    // Hent events for værten, ved hjælp af "fetchHostsEvents" fra proxyService.js
    const results = await proxyService.fetchHostEvents(hostNavn);

    // Send svar tilbage med information
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    // Hvis der er fejl, send fejlbesked
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Eksporterer funktionen så den kan bruges i andre filer
module.exports = {
  getHostEvents
};

