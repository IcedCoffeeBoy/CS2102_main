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
router.get('/', function (req, res, next) {
  db.query(sql_getDatejoined, [req.user.id], (err, datejoined) => {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    datejoined = datejoined.rows[0].datejoined
    datejoined = datejoined.toLocaleDateString("en-US", options)
    db.query(sql_getItems, [req.user.id], (err, data) => {
      console.log(data)
      if (err) {
        console.log(err);
      } else {
        res.render('user', { title: 'User Page', data: data.rows, user: req.user, username: req.user.username, datejoined: datejoined });
      }
    })
  })
});

router.use('/chat', chatRouter);

module.exports = router;
