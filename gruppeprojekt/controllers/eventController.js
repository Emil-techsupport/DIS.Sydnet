const proxyService = require('../services/proxyService');

// GET events fra alle værter via proxy
async function getEvents(req, res, next) {
  try {
    const results = await proxyService.fetchEventsFromHosts();
    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Fejl i controller:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  getEvents
};

