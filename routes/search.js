var express = require('express');
var router = express.Router();
var db = require("../db");
var sql_query = require('../sql');

/*
router.get('/', function(req, res, next) {
  var type = req.query.searchdropdown;
  if (type == "Users") {
    res.redirect('/search/users');
  } else {
    res.redirect('/search/items');
  }
});
*/

router.get('/', search);

function search(req, res, next) {
  var type = req.query.searchdropdown;
  var query = "%" + req.query.query.toLowerCase() + "%";
  var q = "";
  if (type == "Users") {
    q = sql_query.query.search_users;
  } else {
    q = sql_query.query.search_items;
  }
  db.query(q, [query], (err, data) => {
    if (err) {
      console.log("SQL error: " + err);
    } else if (type == "Users") {
      res.render('users', { title: 'User Search', data: data.rows, user: req.user });
    } else {
      res.render('search', { title: 'search', data: data.rows, user: req.user });
    }
  })
};

module.exports = search;