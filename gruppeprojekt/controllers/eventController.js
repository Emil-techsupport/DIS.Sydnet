const proxyService = require('../services/proxyService');

/*
// GET events fra alle værter via proxy
async function getEvents(req, res) {
  try {
    const results = await proxyService.fetchEventsFromHost(); 
   //Sender data til klienten
   console.log("******Results******")
   console.log(results);


    res.json({
      success: true,
      data: results,
    });

  } catch (error) {
    console.error('Fejl i controller:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
*/
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

