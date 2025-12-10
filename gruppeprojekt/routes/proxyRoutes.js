const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventController');
const { checkAuth } = require('../controllers/authController');


// Route til events for en specifik vært (dynamisk)
// Eksempel: /services/hostEvents?host=Anna eller /services/hostEvents?host=Tim
router.get('/hostEvents', checkAuth, eventsController.getHostEvents);

module.exports = router;

