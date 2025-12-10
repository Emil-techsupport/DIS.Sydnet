const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventController');
const { checkAuth } = require('../controllers/authController');

/*
// Route definerer URL og peger til controller, kalder getEvents funktionen i eventController.js
router.get('/hostsWithEvents', eventsController.getEvents);
*/

// Route til events for en specifik vært (dynamisk)
// Eksempel: /services/hostEvents?host=Anna eller /services/hostEvents?host=Tim
// Beskyttet - kræver login
router.get('/hostEvents', checkAuth, eventsController.getHostEvents);

module.exports = router;

