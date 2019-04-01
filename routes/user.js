var express = require('express');
var router = express.Router();
var db = require('../db');
var chatRouter = require('./chat');

var sql_getItems =
  'SELECT * ' +
  'FROM Items NATURAL JOIN Images ' +
  'WHERE seller = $1 AND imgno = 0' +
  'ORDER BY timeListed DESC';

const sql_getDatejoined = 'select datejoined from accounts where accountid = $1';
const sql_getBidItems = "select itemid, description, max(amount) as amount, title, price, imgurl " +
  "from relationships natural join bids natural join items natural join images " +
  "where imgNo=0 and buyer=$1 " + 
  "group by itemid, description, title, price, imgurl"

/* GET user listing. */
router.get('/', async (req, res, next) => {
  try {
    // Attempt parallel SQL execution for speed
    let results = await Promise.all([
      db.db_promise(sql_getDatejoined, [req.user.id]),
      db.db_promise(sql_getItems, [req.user.id]),
      db.db_promise(sql_getBidItems, [req.user.id])
    ])
    let options = { year: 'numeric', month: 'long', day: 'numeric' }
    let datejoineds = results[0]
    datejoined = datejoineds[0].datejoined.toLocaleDateString("en-US", options)

    let data = results[1]
    let biditems = results[2]

    res.render('user', {
      title: 'User Page',
      data: data, user: req.user,
      username: req.user.username,
      datejoined: datejoined,
      biditems: biditems
    });
  } catch (err) {
    console.log(err)
  }
});

router.use('/chat', chatRouter);

module.exports = router;
