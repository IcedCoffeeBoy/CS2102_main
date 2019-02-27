var express = require('express');
var router = express.Router();
var db = require('../db');
var passport = require('passport')

/* GET home page. */
router.get('/', function (req, res, next) {
  if (!req.isAuthenticated()) {
    res.render('index', { title: 'Stuff Sharing' });
  } else {
    res.redirect('/main')
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/main', // redirect to the secure profile section
  failureRedirect: '/', // redirect back to the signup page if there is an error
}))

router.post('/reg', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

  console.log(req.body);

  var sqlquery = "insert into accounts(username,password,email) values($1,$2,$3)";

  db.query(sqlquery, [username, password, email], function (err, data) {
    if (err) {
      console.log(err);
      res.send({ valid: false });
    } else {
      console.log("Sucessfully created account");
      res.redirect('/');
    }
  })
})

module.exports = router;
