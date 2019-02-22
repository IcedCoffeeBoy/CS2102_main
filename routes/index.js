var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var input = [username, password];
  console.log(req.query);
  console.log(input);
  //To verify username and password with database
  var sqlquery = "select 1 from accounts where username=$1 and password=$2";

  db.query(sqlquery, [username, password], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data.rowCount == 1) {
        res.redirect('/main');
      } else {
        res.send(500, 'Unable to find user')
      }
    }
  })
})

router.post('/reg', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

  console.log(req.body);

  if (!validateEmail(email)) {
    res.send({ valid: false , params: email});
    return; 
  }

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

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


module.exports = router;
