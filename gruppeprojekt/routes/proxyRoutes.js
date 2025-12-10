const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventController');


// Route til at få fat i events for en given vært
// Bliver kaldt således: '/services/hostEvents?host=' given host er forskellige alt efter hvad der skal bruges i koden
router.get('/hostEvents', eventsController.getHostEvents);

module.exports = router;

