var express = require('express');
var router = express.Router();
var db = require('../db');

var sql_getItems = 'SELECT * FROM Items NATURAL JOIN Images WHERE seller = $1 ORDER BY timeListed DESC;'

/* GET users listing. */
router.get('/', function (req, res, next) {
  db.query(sql_getItems, [req.user.id], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.render('user', {title: 'User Page', data: data.rows, user: req.user});
    }
  })
});

module.exports = router;
