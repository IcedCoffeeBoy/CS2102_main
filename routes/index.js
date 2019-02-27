var express = require('express');
var router = express.Router();
var db = require('../db');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

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
  failureFlash: true,
}))

router.post('/reg', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var saltRounds = "10";
  console.log(req.body);

  var sqlquery = "insert into accounts(username,password,email) values($1,$2,$3)";

  bcrypt.hash(password, null,null, function (err, hash) {
    // Store hash in your password DB.
    if (err) {
      console.log(err);
      res.send({ valid: false });
    } else {
      db.query(sqlquery, [username, hash, email], function (err, data) {
        if (err) {
          console.log(err);
          res.send({ valid: false });
        } else {
          console.log("Sucessfully created account");
          res.redirect('/');
        }
      })
    }
  });
})

module.exports = router;
