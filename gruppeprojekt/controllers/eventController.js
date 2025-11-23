const proxyService = require('../services/proxyService');

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

// Eksporter "getEvents" så vi kan bruge den i andre filer
module.exports = {
  getEvents
};

