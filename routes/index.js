var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  var username = req.query.username;
  var password = req.query.password;
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
        res.send(500,'Unable to find user') 
      }
    }
  })
})

router.post('/reg', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

  console.log(req.body);

  var sqlquery = "insert into accounts(username,password,email) values($1,$2,$3)";

  db.query(sqlquery, [username, password, email], function (err, data) {
      if(err){
        console.log(err);
        res.send({valid: false});
      } else {
        console.log("Sucessfully created account");
        res.redirect('/');
      }
  })
})

module.exports = router;
