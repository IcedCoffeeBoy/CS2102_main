var express = require('express');
var router = express.Router();
var db = require("../db");

router.get('/', function (req, res, next) {
  var sqlquery = 'select itemid,title, description, price, imgurl from items natural join images'
  var sampledata = [
    { title: 'Good doggo', description: "Dogs for sharing", price: "99", img: "https://boygeniusreport.files.wordpress.com/2016/11/puppy-dog.jpg?quality=98&strip=all" },
    { title: 'Cute cats', description: "Cats for you to serve", price: "21", img: "https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=978&q=80" },
  ]

  db.query(sqlquery, function (err, data) {
    if (err) {
      console.log("SQL error:" + err)
    } else {
      res.render('main', { title: 'main', data: data.rows, user: req.user });
    }
  })
});

module.exports = router;
