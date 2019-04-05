var express = require('express');
var router = express.Router();
var db = require('../db');
const sql = require('../sql/index');

/* GET user listing. */
router.get('/', async (req, res, next) => {
  try {
    // Attempt parallel SQL execution for speed
    let results = await Promise.all([
      db.db_promise(sql.sql_getDatejoined, [req.user.id]),
      db.db_promise(sql.sql_getItems, [req.user.id]),
      db.db_promise(sql.sql_getBidItems, [req.user.id]),
      db.db_promise(sql.sql_getSoldItems, [req.user.id]),
      db.db_promise(sql.sql_getSuccessfulBids, [req.user.id])
    ]);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let datejoineds = results[0];
    datejoined = datejoineds[0].datejoined.toLocaleDateString("en-US", options);

    let data = results[1]
    let biditems = results[2]
    let solditems = results[3]
    let successfulbids = results[4]

    res.render('user', {
      title: 'User Page',
      data: data, user: req.user,
      username: req.user.username,
      datejoined: datejoined,
      biditems: biditems,
      solditems: solditems,
      successfulbids: successfulbids,
      options: options
    });
  } catch (err) {
    console.log(err)
  }
});

module.exports = router;
