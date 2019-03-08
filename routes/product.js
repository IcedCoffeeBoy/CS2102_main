var express = require("express");
var router = express.Router();
var db = require('../db');

router.get("/", function(req, res, next) {
  res.send("<h1>No product listing code provided!</h1>");
});

router.get("/:productId", function(req, res, next) {
  var sqlquery = 'select title, description, price, imgurl from items natural join images';

  db.query(sqlquery, function (err, data) {
    if (err) {
      console.log("SQL error:" + err)
    } else {
      res.render('product', { title: 'productlisting', data: data.rows, user: req.user, tparam: req.params.productId});
    }
  })
});

module.exports = router;
