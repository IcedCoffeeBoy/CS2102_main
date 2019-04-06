var express = require('express');
var router = express.Router();
var db = require("../db");
var sql = require("../sql/index");

router.get('/', async function (req, res, next) {

  try {
    let promises = [
      db.db_promise(sql.sql_getPopularItems),
      db.db_promise(sql.sql_getTopRatedItems)
    ]
    let results = await Promise.all(promises)
    res.render('main', { 
      title: 'main',
      data: results[0],
      data2: results[1], 
      user: req.user 
    });
  } catch (err) {
    console.log(err)
  }
});

module.exports = router;
