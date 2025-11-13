const express = require('express');
const router = express.Router();

/* GET hosts listing. */
router.get('/', function(req, res, next) {
  res.json({ message: 'Hosts endpoint' });
});

module.exports = router;

