const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventController');

// Route definerer URL og peger til controller, kalder getEvents funktionen i eventController.js
router.get('/events', eventsController.getEvents);

module.exports = router;

