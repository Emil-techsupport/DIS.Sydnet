const proxyService = require('../services/proxyService');

// GET events fra alle værter via proxy
async function getEvents(req, res) {
  try {
    const results = await proxyService.fetchEventsFromHosts(); // Henter data fra alle værter via proxy 
   // sender data til klienten
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
// Eksporterer getEvents funktionen så den kan bruges i app.js
module.exports = {
  getEvents
};

