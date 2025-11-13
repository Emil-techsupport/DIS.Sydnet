const express = require('express');
const router = express.Router();

/* GET events listing. */
router.get('/', function(req, res, next) {
  res.json({ message: 'Events endpoint' });
});

module.exports = router;

