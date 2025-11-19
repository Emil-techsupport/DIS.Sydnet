var express = require('express');
var router = express.Router();
const path = require("path");

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/Forside.html'));
});


router.get('/oplevelser', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/Oplevelser.html'));
});

module.exports = router;

