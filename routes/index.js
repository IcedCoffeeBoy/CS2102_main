var express = require('express');
var router = express.Router();
var db = require('../db')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  var username = req.query.username;
  var password = req.query.password;
  var input = [username, password]
  console.log(req.query)
  console.log(input)
  //To verify username and password with database
  var sqlquery = "select 1 from accounts where username=$1 and password=$2"

  db.query(sqlquery, [username, password], (err, data) => {
    if (err) {
      console.log(err)
    } else {
      if(data.rowCount==1){
        res.redirect('/insert');
      } else {
        res.sendStatus(404);
      }
    }
  })
  
})

module.exports = router;
