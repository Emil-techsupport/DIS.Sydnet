var express = require('express');
var router = express.Router();


/* GET users listing. */
/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/

/*
router.get('/oplevelse', function (req, res) {
    res.render('public/oplevelse');
});
*/

const path = require("path");

router.get("/oplevelse", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/oplevelse.html"));
});


module.exports = router;
