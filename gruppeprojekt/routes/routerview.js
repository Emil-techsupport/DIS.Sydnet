var express = require('express');
var router = express.Router();
const path = require("path");

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/forside.html'));
});


router.get('/oplevelser', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/oplevelser.html'));
});

router.get('/kollab', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/kollabside.html'));
});

router.get('/search', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/search.html'));
});


module.exports = router;

