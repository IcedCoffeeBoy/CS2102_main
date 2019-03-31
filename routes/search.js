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

router.get('/', async function (req, res, next) {
  // Query processing
  var type = req.query.searchdropdown;
  var query = "%" + req.query.query.toLowerCase() + "%";
  var q = "";
  if (type == "Users") {
    q = sql_query.query.search_users;
  } else {
    q = sql_query.query.search_items;
  }

  // SQL query execution and page rendering
  try {
    let data = await db.db_promise(q, [query]);

    if (type == "Users") {
      if (req.isAuthenticated()) {
        res.render('users', { title: 'User Search', data: data, user: req.user });
      } else {
        req.flash("message", "Only login user can use this function");
        return res.redirect("../");
      }
    } else {
      return res.render('main', { title: 'search', data: data, user: req.user });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
});

router.get('/:userid', async (req, res, next) => {
  console.log(req.params.userid)

  try {
    // Retrieve user data
    let userdata = await db.db_promise(sql_getuserinfo, [req.params.userid]);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let datejoined = userdata[0].datejoined.toLocaleDateString("en-US", options);
    let username = userdata[0].username;

    // Retrieve user listing data
    let data = await db.db_promise(sql_getItems, [req.params.userid]);

    // res.render('user', { title: 'User Page', data: data, user: req.user, username: username, datejoined: datejoined });
    res.render('user', { title: 'User Page', data, user: req.user, username, datejoined });
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
