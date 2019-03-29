var express = require('express');
var router = express.Router();
var db = require("../db");
var sql_query = require('../sql');
var sql_getItems =
  'SELECT * ' +
  'FROM Items NATURAL JOIN Images ' +
  'WHERE seller = $1 AND imgno = 0' +
  'ORDER BY timeListed DESC;'

var sql_getuserinfo = 'select datejoined, username from accounts where accountid = $1'


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

router.get('/', function (req, res, next) {
  let type = req.query.searchdropdown;
  let query = "%" + req.query.query.toLowerCase() + "%";
  let q = "";
  if (type == "Users") {
    q = sql_query.query.search_users;
  } else {
    q = sql_query.query.search_items;
  }
  db.query(q, [query], (err, data) => {
    if (err) {
      console.log("SQL error: " + err);
    } else if (type == "Users") {
      if (req.isAuthenticated()) {
        return res.render('users', { title: 'User Search', data: data.rows, user: req.user });
      } else {
        req.flash("message", "Only login user can use this function");
        return res.redirect("./");
      }
    } else {
      return res.render('main', { title: 'search', data: data.rows, user: req.user });
    }
  })
});

router.get('/:userid', (req, res, next) => {
  console.log(req.params.userid)
  db.query(sql_getuserinfo, [req.params.userid], (err, userdata) => {
    if (err) {
      console.log(err)
    } else {
      var options = { year: 'numeric', month: 'long', day: 'numeric' };
      datejoined = userdata.rows[0].datejoined
      datejoined = datejoined.toLocaleDateString("en-US", options)
      username = userdata.rows[0].username
      db.query(sql_getItems, [req.params.userid], (err, data) => {
        console.log(data)
        if (err) {
          console.log(err);
        } else {
          res.render('user', { title: 'User Page', data: data.rows, user: req.user, username: username, datejoined: datejoined });
        }
      })
    }
  })
})

module.exports = router;
