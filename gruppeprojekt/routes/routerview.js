var express = require('express');
var router = express.Router();
const path = require("path");
const { checkAuth } = require('../controllers/authController');

/************Router.get til at få forskellige sider vist***************/

/* Viser login som standard */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/login.html'));
});

/* Viser forside */
router.get('/forside', checkAuth, function(req, res) {
  res.sendFile(path.join(__dirname, '../view/Forside.html'));
});
/* Viser information om den enkelte oplevelse */
router.get('/oplevelser', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/Oplevelser.html'));
});
/* Viser søge side, hvor man kan søge efter andre events at samarbejde med */
router.get('/search', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/search.html'));
});
/* Viser kollab/samarbejde side */
router.get('/kollab', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/kollabside.html'));
});
/* Viser log ind siden */
router.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/login.html'));
});

module.exports = router;

