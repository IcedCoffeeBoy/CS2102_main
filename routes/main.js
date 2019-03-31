var express = require('express');
var router = express.Router();
var db = require("../db");

router.get('/', async function (req, res, next) {
  var sqlquery = 'select itemid,title, description, price, imgurl from items natural join images where imgno = 0'
  
  try {
    let data = await db.db_promise(sqlquery, null);

    res.render('main', { title: 'main', data: data, user: req.user });
  } catch (err) {
    console.log(err)
  }
});

module.exports = router;
