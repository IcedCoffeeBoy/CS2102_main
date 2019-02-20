var express = require('express');
var router = express.Router();
var db = require('../db')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function(req,res,next){
  var username  = req.body.username;
	var password  = req.body.password;

  //To verify username and password with database

  res.redirect('/insert');
})

module.exports = router;
