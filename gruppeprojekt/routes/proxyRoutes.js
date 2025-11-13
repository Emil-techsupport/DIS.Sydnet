const express = require('express');
const router = express.Router();
const { fetchEventsFromHosts } = require('../../services/proxyService');

// GET endpoint til at teste proxy service
router.get('/events', async function(req, res, next) {
  try {
    const results = await fetchEventsFromHosts();
    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Fejl i route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

