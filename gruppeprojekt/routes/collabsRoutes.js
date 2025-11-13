const express = require('express');
const router = express.Router();

/* GET collaborations listing. */
router.get('/', function(req, res, next) {
  res.json({ message: 'Collaborations endpoint' });
});

module.exports = router;

