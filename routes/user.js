var express = require('express');
var router = express.Router();
var db = require('../db');
var chatRouter = require('./chat');

var sql_getItems =
  'SELECT * ' +
  'FROM Items NATURAL JOIN Images ' +
  'WHERE seller = $1 AND imgno = 0' +
  'ORDER BY timeListed DESC;'

var sql_getDatejoined = 'select datejoined from accounts where accountid = $1'

/* GET user listing. */
router.get('/', async (req, res, next) => {
  try {
    // Attempt parallel SQL execution for speed
    let results = await Promise.all([
      db.db_promise(sql_getDatejoined, [req.user.id]),
      db.db_promise(sql_getItems, [req.user.id])
    ])
    let options = { year: 'numeric', month: 'long', day: 'numeric' }
    let datejoineds = results[0]
    datejoined = datejoineds[0].datejoined.toLocaleDateString("en-US", options)

    let data = results[1]
    
    res.render('user', { title: 'User Page', data: data, user: req.user, username: req.user.username, datejoined: datejoined });
  } catch (err) {
    console.log(err)
  }
});

router.use('/chat', chatRouter);

module.exports = router;
