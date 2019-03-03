var express = require('express');
var router = express.Router();
var db = require('../db');

var sql_getAccountId = "SELECT accountid FROM Accounts WHERE username = $1";
var sql_getItems = 'SELECT * FROM Items NATURAL JOIN Images WHERE seller = $1'

// QJ:
// Should sort by date listed! Need to modify database to include date listed

/* GET users listing. */
router.get('/', function (req, res, next) {
  db.query(sql_getAccountId, [req.user.username], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      db.query(sql_getItems, [data.rows[0].accountid], (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.render('user', {title: 'User Page', data: data.rows, user: req.user});
        }
      })
    }
  })
});

module.exports = router;
