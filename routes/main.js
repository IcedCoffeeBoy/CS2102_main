var express = require('express');
var router = express.Router();
var db = require("../db");

router.get('/', function (req, res, next) {
  var sqlquery = 'select itemid,title, description, price, imgurl from items natural join images where imgno = 0'
  
  db.query(sqlquery, function (err, data) {
    if (err) {
      console.log("SQL error:" + err)
    } else {
      res.render('main', { title: 'main', data: data.rows, user: req.user });
    }
  })
});

module.exports = router;
