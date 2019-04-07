var express = require('express');
var router = express.Router();
var db = require("../db");
var sql = require('../sql/index');

router.get('/', async function (req, res, next) {
  // Query processing
  var type = req.query.searchdropdown;
  var query = "%" + req.query.query.toLowerCase() + "%";

  // SQL query execution and page rendering
  try {
      if (type == "Users") {
      if (req.isAuthenticated()) {
        let promises = [
          db.db_promise(sql.search_users, [query]),
          db.db_promise(sql.search_usersRating, [query])
        ]
        let data = await Promise.all(promises)
        res.render('users', { title: 'User Search', data: data[0], rating: data[1], user: req.user });
      } else {
        req.flash("message", "Only login user can use this function");
        return res.redirect("../");
      }
    } else {
      let promises = [
        db.db_promise(sql.search_itemsPopular, [query]),
        db.db_promise(sql.search_itemsRated, [query])
      ]
      let data = await Promise.all(promises)
      return res.render('main', { title: 'search', data: data[0], data2: data[1], user: req.user });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
});

router.get('/:userid', async (req, res, next) => {
  try {
    // Retrieve user data
    let userdata = await db.db_promise(sql.sql_getuserinfo, [req.params.userid]);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let datejoined = userdata[0].datejoined.toLocaleDateString("en-US", options);
    let username = userdata[0].username;

    // Retrieve user listing data
    let data = await db.db_promise(sql.sql_getItems, [req.params.userid]);
    let sellerRating = await db.db_promise(sql.sql_getUserRating, [req.params.userid]);

    res.render('user', {
      title: "User Search",
      data,
      user: req.user,
      username,
      datejoined,
      biditems: [],
      solditems: [],
      successfulbids: [],
      revs: [],
      sellerRating: parseFloat(sellerRating[0].rating).toFixed(1),
      crating: sellerRating[0].crating,
    });

  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
