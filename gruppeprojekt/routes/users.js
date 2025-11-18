var express = require('express');
var router = express.Router();


/* GET users listing. */
/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/
router.get('/oplevelse.html', function (req, res) {
    res.render('public/oplevelse.html');
});

module.exports = router;
