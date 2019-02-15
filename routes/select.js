var express = require('express');
var router = express.Router();
var db = require('../db');

/* SQL Query */
var sql_query = 'SELECT * FROM student_info';

router.get('/', function (req, res, next) {
  db.query(sql_query, (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      res.render('select', { title: 'Database Connect', data: data.rows });
    }
  });
});

module.exports = router;
