const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventController');

// Route definerer URL og peger til controller
router.get('/events', eventsController.getEvents);

module.exports = router;

