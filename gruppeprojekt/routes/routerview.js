var express = require('express');
var router = express.Router();
const path = require("path");
const { checkAuth } = require('../controllers/authController');

/* GET home page - vis login som standard */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/login.html'));
});

/* GET forside - vis kun hvis logget ind */
router.get('/forside', checkAuth, function(req, res) {
  res.sendFile(path.join(__dirname, '../view/Forside.html'));
});

router.get('/oplevelser', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/Oplevelser.html'));
});

router.get('/kollab', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/kollabside.html'));
});

router.get('/search', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/search.html'));
});

router.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/login.html'));
});

module.exports = router;

