const proxyService = require('../services/proxyService');


// Hent events for en vært
async function getHostEvents(req, res) {
  try {
    // Hent vært navn fra URL
    const hostNavn = req.query.host;
    
    // Tjek om vært navn er givet
    if (!hostNavn) {
      return res.status(400).json({
        success: false,
        error: 'Vært navn mangler'
      });
    }
    
    // Hent events for værten
    const results = await proxyService.fetchHostEvents(hostNavn);

    // Send svar tilbage
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

// Eksporterer funktionerne så de kan bruges i routes
module.exports = {
  getHostEvents
};

