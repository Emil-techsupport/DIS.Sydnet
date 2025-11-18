var express = require('express');
var router = express.Router();
const path = require("path");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '../view/dashboard.html'));
});

module.exports = router;

